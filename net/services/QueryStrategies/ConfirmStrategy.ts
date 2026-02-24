import {QueryStrategy} from "../interfaces/QueryStrategy";
import TelegramBot from "node-telegram-bot-api";
import {Formatter} from "../../utils/Formatter";
import {Logger} from "../../utils/Logger";
import {Purchase} from "../../models/Purchase";
import {StateManager} from "../StateManager";
import {DataProcessor} from "../DataProcessor";

export class ConfirmStrategy implements QueryStrategy {
    constructor(
        private bot: TelegramBot,
        private state: StateManager,
        private data: DataProcessor
    ) {}

    async handle(query: TelegramBot.CallbackQuery): Promise<void> {
        if (!query.message) return;
        if (!query.data) return;

        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        const queryData = query.data;
        const queryId = query.id;

        const userId: number = Formatter.getId(queryData);

        Logger.debug(this, `UserId : ${userId}, queryId : ${queryId}`);

        if (userId === 0) {
            Logger.warn(this, "User id is 0");
            await this.bot.sendMessage(chatId, "I'm so sorry, I have a problem. Try again later");
            return;
        }

        const purchase: Purchase | null = this.state.completeFlow(userId, chatId);
        if (!purchase) {
            Logger.warn(this, "State is undefined");
            await this.bot.sendMessage(chatId, "I'm so sorry, I have a problem. Try again later");
            return;
        }

        try {
            await this.data.addPurchase(purchase);
        } catch (err) {
            Logger.error(this, "A purchase saving error", err);
            await this.bot.sendMessage(chatId, "There is en error, please try again");
        }

        await this.bot.editMessageText("✅ I added the purchase", {
            reply_markup: {
                inline_keyboard: [
                    [ { text: "➕ Add more", callback_data: "add" }, { text: "History", callback_data: "history" } ]
                ]
            },
            chat_id: chatId,
            message_id: messageId
        });

        void this.bot.answerCallbackQuery(queryId);
    }
}