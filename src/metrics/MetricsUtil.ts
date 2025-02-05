import * as path from "path";
import { Range, TextDocument, ExtensionContext, window, DocumentFilter } from "vscode";
import { LanguageClientOptions, ServerOptions, TransportKind, LanguageClient } from "vscode-languageclient/node";

import { MetricsRequestType, RequestData } from "./common/protocol";
import { CodeMetricsCodeLens } from "../models/CodeMetricsCodeLens";
import { AppConfiguration } from "../models/AppConfiguration";
import { IMetricsModel, MetricsModel } from "../tsmetrics-core/MetricsModel";

export class MetricsUtil {
    public appConfig: AppConfiguration;
    private client: LanguageClient;
    private started: Promise<void>;

    constructor(appConfig: AppConfiguration, context: ExtensionContext) {
        this.appConfig = appConfig;
        let serverModule = context.asAbsolutePath(path.join("dist", "server.js"));

        let debugOptions = { execArgv: ["--nolazy", "--inspect=6004"] };

        let serverOptions: ServerOptions = {
            run: { module: serverModule, transport: TransportKind.ipc },
            debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
        };
        var output = window.createOutputChannel("CodeMetrics");

        let clientOptions: LanguageClientOptions = {
            documentSelector: this.selector.map((p) => p.language),
            diagnosticCollectionName: "codemetrics",
            errorHandler: {
                error: (_, message) => {
                    output.appendLine(message.jsonrpc);
                    return { action: undefined };
                },

                closed: () => {
                    return undefined;
                },
            },
            synchronize: {
                configurationSection: "codemetrics",
            },
        };

        this.client = new LanguageClient("codemetrics", "CodeMetrics client", serverOptions, clientOptions);
        this.started = this.client.start();
    }

    get selector(): DocumentFilter[] {
        const tsDocSelector = "typescript";
        const jsDocSelector = "javascript";
        const jsxDocSelector = "javascriptreact";
        const tsxDocSelector = "typescriptreact";
        const htmlDocSelector = "html";

        const supportedSchemes = ["file", "untitled"];
        const supportedLanguages = [
            tsDocSelector,
            jsDocSelector,
            jsxDocSelector,
            tsxDocSelector,
            htmlDocSelector,
        ];

        const resultingSelector = supportedLanguages
            .map((language) =>
                supportedSchemes.map((scheme) => {
                    return {
                        scheme: scheme,
                        language: language,
                    };
                })
            )
            .reduce((acc, cur) => acc.concat(cur), []);
        return resultingSelector;
    }

    public getMetrics(document: TextDocument): Thenable<IMetricsModel[]> {
        const requestData: RequestData = {
            uri: document.uri.toString(),
            configuration: this.appConfig.getCodeMetricsSettings(document.uri),
        };
        return this.started.then(() =>
            this.client.sendRequest(MetricsRequestType, requestData).then((metrics) =>
                metrics.map((m) => {
                    return this.convert(m);
                })
            )
        );
    }
    private convert(m: IMetricsModel): IMetricsModel {
        let model = new MetricsModel(
            m.start,
            m.end,
            m.text,
            m.line,
            m.column,
            m.complexity,
            m.description,
            false,
            m.visible,
            m.collectorType
        );
        model.children = m.children.map((c) => this.convert(c));
        return model;
    }

    public format(model: CodeMetricsCodeLens): string {
        return model.toString();
    }

    public toRange(model: IMetricsModel, document: TextDocument): Range {
        return new Range(document.positionAt(model.start), document.positionAt(model.end));
    }
    public toRangeFromOffset(start: number, document: TextDocument): Range {
        return new Range(document.positionAt(start), document.positionAt(start));
    }
    public toDecorationRange(start: number, document: TextDocument): Range {
        const pos = document.positionAt(start);
        const line = pos.line;
        const documentLine = document.lineAt(line);
        const lineRange = documentLine.range;
        return new Range(lineRange.end.line, lineRange.end.character, lineRange.end.line, lineRange.end.character);
    }
}
