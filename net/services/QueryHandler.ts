import TelegramBot, {CallbackQuery} from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";

export class QueryHandler {

    constructor(private bot: TelegramBot) {}

    async handle(query: CallbackQuery): Promise<void> {
        try {
            if (!query) return;
            if (!query.message) return;

            const chatId = query.message.chat.id;
            const messageId = query.message.message_id;

            if (query.data === "command_list") {
                await this.bot.editMessageText(
                    "/help - instruction for use\n /ref - get referral link\n /options - bot options\n" +
                    "/add - create purchase\n /history - your purchase history",
                    {
                        chat_id: chatId,
                        message_id: messageId,
                    });
            } else {
                return;
            }
            await this.bot.answerCallbackQuery(query.id);
        } catch (err) {
            Logger.error("An error occurred while handling the callback", getContext(this), query.message);
        }
    }
}