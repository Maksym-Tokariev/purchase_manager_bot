import {QueryStrategy} from "../interfaces/QueryStrategy";
import TelegramBot from "node-telegram-bot-api";

export class ShowCommandListStrategy implements QueryStrategy {
    constructor(private bot: TelegramBot) {}

    async handle(query: TelegramBot.CallbackQuery): Promise<void> {
        await this.bot.editMessageText(
            "/help - instruction for use\n /ref - get referral link\n /options - bot options\n" +
            "/add - create purchase\n /history - your purchase history",
            {
                chat_id: query.message?.chat.id,
                message_id: query.message?.message_id,
            });
        void this.bot.answerCallbackQuery(query.id);
    }
}