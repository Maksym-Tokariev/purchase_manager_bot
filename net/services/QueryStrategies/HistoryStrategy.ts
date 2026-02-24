import {QueryStrategy} from "../interfaces/QueryStrategy";
import TelegramBot, {CallbackQuery} from "node-telegram-bot-api";
import {PurchaseDTO} from "../../models/PurchaseDTO";
import {config} from "../../config/Config";
import {DataProcessor} from "../DataProcessor";
import {MessageSender} from "../MessageSender";

export class HistoryStrategy implements QueryStrategy {

    constructor(
        private bot: TelegramBot,
        private data: DataProcessor,
        private sender: MessageSender
    ) {}

    async handle(query: CallbackQuery): Promise<void> {
        if (!query.message) return;
        const chatId = query.message.chat.id;
        const userId = query.from.id;

        const data: PurchaseDTO[] = await this.data.getLastPurchases(userId, config.history_limit);
        await this.sender.sendHistory(chatId, data);
        void this.bot.answerCallbackQuery(query.id);
    }
}