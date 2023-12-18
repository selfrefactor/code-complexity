import { RequestType } from "vscode-languageserver";
import { IVSCodeMetricsConfiguration } from "./VSCodeMetricsConfiguration";
import { IMetricsModel } from "../../tsmetrics-core/MetricsModel";

export class RequestData {
    configuration: IVSCodeMetricsConfiguration;
    uri: string;
}

export const MetricsRequestType: RequestType<RequestData, IMetricsModel[], any> = new RequestType(
    "codemetrics/metrics"
);
