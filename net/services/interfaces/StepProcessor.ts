import {PurchaseState} from "../../models/PurchaseState";

export interface StepProcessor {
    process(state: PurchaseState, input: string): void;
}