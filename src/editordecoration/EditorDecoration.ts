import {
  TextEditorDecorationType,
  Disposable,
  ExtensionContext,
  workspace,
  window,
  DecorationOptions,
  TextEditor,
  Uri,
  DecorationRenderOptions,
  OverviewRulerLane,
  DecorationRangeBehavior,
} from 'vscode'
import {MetricsUtil} from '../metrics/MetricsUtil'
import {IVSCodeMetricsConfiguration} from '../metrics/common/VSCodeMetricsConfiguration'
import {getColor} from './get-color'
import { IMetricsModel } from '../tsmetrics-core/MetricsModel'

export class EditorDecoration implements Disposable {
  private decoratorInstances: TextEditorDecorationType[] = []
  private decorationModeEnabled: boolean = false
  private decorationTemplate: string
  private overviewRulerModeEnabled: boolean = false

  private metricsUtil: MetricsUtil
  private didChangeTextDocument: Disposable
  private didOpenTextDocument: Disposable
  constructor(context: ExtensionContext, metricsUtil: MetricsUtil) {
    this.metricsUtil = metricsUtil

    const debouncedUpdate = this.debounce(() => this.update(), 800)
    this.didChangeTextDocument = workspace.onDidChangeTextDocument(e => {
      debouncedUpdate()
    })
    this.didOpenTextDocument = window.onDidChangeActiveTextEditor(e => {
      this.disposeDecorators()
      this.update()
    })
    this.update()
  }

  private debounce(func: () => void, timeout): () => void {
    let id
    return () => {
      clearTimeout(id)
      id = setTimeout(() => func(), timeout)
    }
  }

  private update() {
    const editor = window.activeTextEditor

    if (!editor || !editor.document) {
      return
    }
    const document = editor.document
    const settings = this.metricsUtil.appConfig.getCodeMetricsSettings(
      document.uri
    )

    const languageDisabled =
      this.metricsUtil.selector.filter(
        s => s.language == document.languageId
      ).length == 0
    const decorationDisabled = !(
      settings.DecorationModeEnabled || settings.OverviewRulerModeEnabled
    )
    if (decorationDisabled || languageDisabled) {
      this.clearDecorators(editor)
      return
    }
    // for some reason the context is lost
    var thisContext = this
    const size: number = workspace
      .getConfiguration('editor', document.uri)
      .get('fontSize')
    this.metricsUtil.getMetrics(document).then(
      metrics => {
        if (
          thisContext.settingsChanged(settings) ||
          this.decoratorInstances.length === 0
        ) {
          thisContext.clearDecorators(editor)
        }
        const toDecoration = (model: IMetricsModel): DecorationOptions => {
          return {
            hoverMessage: model.toString(settings),
            range: thisContext.metricsUtil.toDecorationRange(
              model.start,
              document
            ),
          }
        }
        const complexityAndModel: ComplexityToModel[] = metrics.map(p => {
          return {complexity: p.getCollectedComplexity(), model: p}
        })

        const decorations = complexityAndModel.map(p => ({
          decorationStyle: toDecoration(p.model),
          complexity: p.complexity,
        }))

        // need to reset all decorations before setting new ones
        thisContext.decoratorInstances.forEach(decorator => {
          editor.setDecorations(decorator, [])
        })

        const decoratorInstances = decorations.map(
          ({decorationStyle, complexity}) => {
            const decoration = this.createDecorationType(
              settings.DecorationModeEnabled,
              settings.OverviewRulerModeEnabled,
              settings.DecorationTemplate,
              getColor(complexity),
              size
            )
            editor.setDecorations(decoration, [decorationStyle])

            return decoration
          }
        )
        thisContext.decoratorInstances = decoratorInstances
      },
      e => {
        var exmsg = ''
        if (e.message) {
          exmsg += e.message
        }
        if (e.stack) {
          exmsg += ' | stack: ' + e.stack
        }
        console.error(exmsg)
      }
    )
  }
  private settingsChanged(settings: IVSCodeMetricsConfiguration): boolean {
    const changed =
      settings.DecorationModeEnabled != this.decorationModeEnabled ||
      settings.DecorationTemplate != this.decorationTemplate ||
      settings.OverviewRulerModeEnabled != this.overviewRulerModeEnabled
    this.decorationModeEnabled = settings.DecorationModeEnabled
    this.decorationTemplate = settings.DecorationTemplate
    this.overviewRulerModeEnabled = settings.OverviewRulerModeEnabled
    return changed
  }
  private clearDecorators(editor: TextEditor) {
    if (this.decoratorInstances.length > 0) {
      this.decoratorInstances.forEach(decorator => {
        editor.setDecorations(decorator, [])
      })
      this.decoratorInstances = []
    }
    this.disposeDecorators()
  }

  createDecorationType(
    decorationModeEnabled: boolean,
    overviewRulerModeEnabled: boolean,
    decorationTemplate: string,
    color: string,
    size: number
  ) {
    const options: DecorationRenderOptions = {
      overviewRulerLane: OverviewRulerLane.Right,
      overviewRulerColor: color,
      before: {
        contentIconPath: this.getContentIconPath(
          decorationTemplate,
          color,
          size
        ),
        margin: `${size / 2}px`,
      },
    }
    if (!decorationModeEnabled) {
      options.before = null
    }
    if (!overviewRulerModeEnabled) {
      options.overviewRulerColor = null
    }
    options.rangeBehavior = DecorationRangeBehavior.ClosedClosed
    return window.createTextEditorDecorationType(options)
  }
  getContentIconPath(
    decorationTemplate: string,
    color: string,
    size: number
  ): Uri {
    const templateVariables = {color, size}
    const decoration = decorationTemplate.replace(
      /\{\{(.+?)\}\}/g,
      (match, varName) => templateVariables[varName]
    )
    return Uri.parse(`data:image/svg+xml,` + encodeURIComponent(decoration))
  }
  disposeDecorators() {
    if (this.decoratorInstances.length > 0) {
      this.decoratorInstances.forEach(decorator => {
        decorator.dispose()
      })
    }
    this.decoratorInstances = []
  }

  public dispose(): void {
    this.disposeDecorators()
    this.didChangeTextDocument.dispose()
    this.didOpenTextDocument.dispose()
  }
}

interface ComplexityToModel {
  complexity: number
  model: IMetricsModel
}
