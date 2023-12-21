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
import {interpolate, toDecimal} from 'rambdax'
import {IMetricsModel} from '../tsmetrics-core/MetricsModel'

let decorationTemplateSimple =
  "<svg xmlns='http://www.w3.org/2000/svg' width='{{size}}px' height='{{size}}px' viewbox='0 0 {{size}} {{size}}'><rect width='{{size}}px' height='{{size}}px' style='fill:{{color}};stroke-width:1px;stroke:{{color}}'/></svg>"
let decorationTemplateComplex =
  "<svg xmlns='http://www.w3.org/2000/svg' width='{{size}}px' height='{{size}}px' viewbox='0 0 {{size}} {{size}}'><rect width='{{size}}px' height='{{size}}px' style='fill:{{color}};stroke-width:1px;stroke:{{color}}'/><text dy='1px' x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' style='fill:#fff;font-size:{{textSize}}px;'>{{complexity}}</text></svg>"

export class EditorDecoration implements Disposable {
  private decoratorInstances: TextEditorDecorationType[] = []
  private decorationModeEnabled: boolean = false
  private overviewRulerModeEnabled: boolean = false

  private metricsUtil: MetricsUtil
  private onDidSaveTextDocument: Disposable
  private didChangeTextDocument: Disposable
  private didOpenTextDocument: Disposable
  constructor(context: ExtensionContext, metricsUtil: MetricsUtil) {
    this.metricsUtil = metricsUtil

    this.onDidSaveTextDocument = workspace.onDidSaveTextDocument(e => {
      this.update()
    })
    this.didChangeTextDocument = workspace.onDidChangeTextDocument(e => {
      this.resetDecorators()
    })
    this.didOpenTextDocument = window.onDidChangeActiveTextEditor(e => {
      this.disposeDecorators()
      this.update()
    })
    this.update()
  }

  private resetDecorators() {
    if (this.decoratorInstances.length == 0) return
    const editor = window.activeTextEditor

    this.decoratorInstances.forEach(decorator => {
      editor.setDecorations(decorator, [])
    })
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
            hoverMessage: model.toString(),
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
              getColor(complexity),
              size,
              complexity
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
      settings.OverviewRulerModeEnabled != this.overviewRulerModeEnabled
    this.decorationModeEnabled = settings.DecorationModeEnabled
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
    color: string,
    size: number,
    complexity: number
  ) {
    const options: DecorationRenderOptions = {
      overviewRulerLane: OverviewRulerLane.Right,
      overviewRulerColor: color,
      before: {
        contentIconPath: this.getContentIconPath(color, size, complexity),
        margin: `${size * 2}px`,
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
  getContentIconPath(color: string, size: number, complexity: number): Uri {
    const template =
      complexity >= 12 ? decorationTemplateComplex : decorationTemplateSimple
    const textSize = toDecimal(size * 0.85)
    const decoration = interpolate(template, {
      color,
      size,
      complexity,
      textSize,
    })

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
    this.onDidSaveTextDocument.dispose()
    this.didOpenTextDocument.dispose()
    this.didChangeTextDocument.dispose()
  }
}

interface ComplexityToModel {
  complexity: number
  model: IMetricsModel
}
