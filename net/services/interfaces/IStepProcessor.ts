import {PurchaseState} from "../../models/PurchaseState";

export interface IStepProcessor {
    process(state: PurchaseState, input: string): void;
}