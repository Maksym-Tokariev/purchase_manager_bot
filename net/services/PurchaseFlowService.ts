import TelegramBot from "node-telegram-bot-api";
import {StateManager} from "./StateManager";
import {PurchaseStep} from "../models/PurchaseStep";
import {StepHandler} from "./StepHandler";

export class PurchaseFlowService {
    constructor(
        private bot: TelegramBot,
        private stateManager: StateManager,
        private stepHandler: StepHandler
    ) {}

    async startPurchaseFlow(userId: number, chatId: number): Promise<void> {
        this.stateManager.startFlow(userId, chatId);
        await this.sendStepMessage(userId, PurchaseStep.NAME);
    }

    async handleUserMessage(userId: number, text: string): Promise<void> {
        const state = this.stateManager.getCurrState(userId);

        if (!state) return;

        switch (state.currentStep) {
            case PurchaseStep.NAME:
                await this.stepHandler.handleName(userId, text);
                break;
            case PurchaseStep.PRICE:
                await this.stepHandler.handlePrice(userId, text);
                break;
            case PurchaseStep.DATE:
                await this.stepHandler.handleDate(userId, text);
                break;
            default:
                await this.stepHandler.setIdle(userId);
        }
    }

    private async sendStepMessage(userId: number, step: PurchaseStep): Promise<void> {
        switch (step) {
            case PurchaseStep.NAME:
            case PurchaseStep.PRICE:
            case PurchaseStep.DATE:
            case PurchaseStep.CONFIRM:
        }
    }
}