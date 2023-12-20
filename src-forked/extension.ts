import { ExtensionContext } from "vscode";
import { AppConfiguration } from "./models/AppConfiguration";
import { MetricsUtil } from "./metrics/MetricsUtil";
import { EditorDecoration } from "./editordecoration/EditorDecoration";

export function activate(context: ExtensionContext) {
    const config: AppConfiguration = new AppConfiguration();
    const metricsUtil: MetricsUtil = new MetricsUtil(config, context);

    context.subscriptions.push(new EditorDecoration(context, metricsUtil));
}
