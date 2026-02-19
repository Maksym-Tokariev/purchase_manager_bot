import {PurchaseStep} from "../models/PurchaseStep";
import {StateManager} from "./StateManager";
import {StepHandler} from "./StepHandler";

export class MessageHandler {

    constructor(
        private stateManager: StateManager,
        private stepHandler: StepHandler
    ) {}

    async handle(userId: number, chatId: number, text: string): Promise<void> {
        const state = this.stateManager.getCurrState(userId);

        if (!state) return;

        switch (state.currentStep) {
            case PurchaseStep.NAME:
                await this.stepHandler.handleName(userId, chatId, text, state);
                break;
            case PurchaseStep.PRICE:
                await this.stepHandler.handlePrice(userId, chatId, text, state);
                break;
            case PurchaseStep.DATE:
                await this.stepHandler.handleDate(userId, chatId, text, state);
                break;
            case PurchaseStep.CONFIRM:
                await this.stepHandler.handleConfirm(userId, chatId, text, state);
                break;
            default:
                await this.stepHandler.setIdle(userId, state);
        }
    }
}