import TelegramBot from "node-telegram-bot-api";
import {StateManager} from "./StateManager";
import {PurchaseStep} from "../models/PurchaseStep";
import {MessageSender} from "./MessageSender";

export class PurchaseFlowService {
    constructor(
        private bot: TelegramBot,
        private messageSender: MessageSender,
        private stateManager: StateManager,
    ) {}

    async startPurchaseFlow(userId: number, chatId: number): Promise<void> {
        this.stateManager.startFlow(userId, chatId);
        await this.messageSender.sendStepMessage(userId, chatId, PurchaseStep.NAME);
    }
}