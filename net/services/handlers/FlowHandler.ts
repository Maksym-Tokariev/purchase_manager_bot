import {PurchaseStep} from "../../models/PurchaseStep";
import {StepProcessor} from "../interfaces/StepProcessor";

export class FlowHandler {
    private steps: Map<PurchaseStep, StepProcessor> = new Map();

}