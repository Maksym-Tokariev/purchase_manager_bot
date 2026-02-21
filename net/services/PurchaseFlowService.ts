import TelegramBot from "node-telegram-bot-api";
import {StateManager} from "./StateManager";
import {PurchaseStep} from "../models/PurchaseStep";
import {MessageSender} from "./MessageSender";
import {StepHandler} from "./handlers/StepHandler";

export class PurchaseFlowService {
    constructor(
        private bot: TelegramBot,
        private messageSender: MessageSender,
        private state: StateManager,
        private step: StepHandler
    ) {}

    async startAddFlow(userId: number, chatId: number): Promise<void> {
        this.state.startFlow(userId, chatId, PurchaseStep.NAME);

        setTimeout(() => {
            if (this.state.isInFlow(userId)) {
                this.state.cancelFlow(userId, chatId);
                this.messageSender.send(chatId, "Время сессии истекло. Начните заново.");
            }
        }, 5 * 60 * 1000);

        await this.messageSender.sendStepMessage(userId, chatId, PurchaseStep.NAME);
    }

    async startEditFlow(userId: number, chatId: number): Promise<void> {

    }

    public async handleFlow(userId: number, chatId: number, text: string): Promise<void> {
        const state = this.state.getCurrState(userId);

        if (!state) return;

        switch (state.currentStep) {
            case PurchaseStep.NAME:
                await this.step.handleName(userId, chatId, text, state);
                break;
            case PurchaseStep.PRICE:
                await this.step.handlePrice(userId, chatId, text, state);
                break;
            case PurchaseStep.DATE:
                await this.step.handleDate(userId, chatId, text, state);
                break;
            case PurchaseStep.CONFIRM:
                await this.step.handleConfirm(userId, chatId, text, state);
                break;
            default:
                await this.step.setIdle(userId, state);
        }
    }
}