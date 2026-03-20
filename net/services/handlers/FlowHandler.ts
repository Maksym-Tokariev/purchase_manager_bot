import {PurchaseStep} from "../../models/PurchaseStep";
import {IStepProcessor} from "../interfaces/IStepProcessor";

export class FlowHandler {
    private steps: Map<PurchaseStep, IStepProcessor> = new Map();

}