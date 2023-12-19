import { IMetricsConfiguration, MetricsConfiguration } from "../../tsmetrics-core/MetricsConfiguration";

const VSCodeMetricsConfigurationDefaults = {
    Exclude: [],
    EnabledForJS: true,
    EnabledForJSX: true,
    EnabledForTS: true,
    EnabledForTSX: true,
    EnabledForHTML: true,
    DecorationModeEnabled: true,
    OverviewRulerModeEnabled: true,
    CodeLensEnabled: false,
    FileSizeLimitMB: 0.5,
};

export type IVSCodeMetricsConfiguration = typeof VSCodeMetricsConfigurationDefaults & IMetricsConfiguration;

export const getInitialVSCodeMetricsConfiguration: () => IVSCodeMetricsConfiguration = () => {
    return {
        ...MetricsConfiguration,
        ...VSCodeMetricsConfigurationDefaults,
    };
};
