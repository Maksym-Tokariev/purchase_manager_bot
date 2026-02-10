import TelegramBot from "node-telegram-bot-api";
import {StateManager} from "./StateManager";
import {PurchaseStep} from "../models/PurchaseStep";
import {StepHandler} from "./StepHandler";
import {MessageSender} from "./MessageSender";

export class PurchaseFlowService {
    constructor(
        private bot: TelegramBot,
        private messageSender: MessageSender,
        private stateManager: StateManager,
        private stepHandler: StepHandler
    ) {}

    async startPurchaseFlow(userId: number, chatId: number): Promise<void> {
        this.stateManager.startFlow(userId, chatId);
        await this.messageSender.sendStepMessage(userId, chatId, PurchaseStep.NAME);
    }

    async handleUserMessage(userId: number, text: string): Promise<void> {
        const state = this.stateManager.getCurrState(userId);

        if (!state) return;

        switch (state.currentStep) {
            case PurchaseStep.NAME:
                await this.stepHandler.handleName(userId, text, state);
                break;
            case PurchaseStep.PRICE:
                await this.stepHandler.handlePrice(userId, text, state);
                break;
            case PurchaseStep.DATE:
                await this.stepHandler.handleDate(userId, text, state);
                break;
            default:
                await this.stepHandler.setIdle(userId, state);
        }
    }
}