import {PurchaseState} from "../models/PurchaseState";
import {PurchaseStep} from "../models/PurchaseStep";

export class StepHandler {

    async handleName(userId: number, text: string, state: PurchaseState): Promise<void> {

    }

    async handlePrice(userId: number, text: string, state: PurchaseState): Promise<void> {

    }

    async handleDate(userId: number, text: string, state: PurchaseState): Promise<void> {

    }

    async setIdle(userId: number, state: PurchaseState): Promise<void> {
        if (state.currentStep !== PurchaseStep.IDLE) {
            state.currentStep = PurchaseStep.IDLE;
        }
    }
}