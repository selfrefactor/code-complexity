import { CodeLens, Range, Uri } from "vscode";
import { IMetricsModel } from "../tsmetrics-core/MetricsModel";

export class CodeMetricsCodeLens extends CodeLens {
    // todo remove uri
    constructor(public model: IMetricsModel, private uri: Uri, range: Range) {
        super(range);
    }

    public getCollectedComplexity(): number {
        return this.model.getCollectedComplexity();
    }

    public toString(): string {
        return this.model.toString();
    }

    // todo remove
    public getExplanation(): string {
        return this.model.getExplanation();
    }

    public getChildren() {
        return this.model.children;
    }
}
