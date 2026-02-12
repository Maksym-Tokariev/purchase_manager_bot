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

    async handleUserMessage(userId: number, chatId: number, text: string): Promise<void> {
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