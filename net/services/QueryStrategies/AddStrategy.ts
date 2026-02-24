import {QueryStrategy} from "../interfaces/QueryStrategy";
import TelegramBot from "node-telegram-bot-api";
import {PurchaseFlowService} from "../PurchaseFlowService";

export class AddStrategy implements QueryStrategy {
    constructor(
        private bot: TelegramBot,
        private flow: PurchaseFlowService
    ) {}

    async handle(query: TelegramBot.CallbackQuery): Promise<void> {
        if (!query.message) return;

        const chatId = query.message.chat.id;
        const userId = query.from.id;

        await this.flow.startAddFlow(userId, chatId);
        void this.bot.answerCallbackQuery(query.id);
    }
}