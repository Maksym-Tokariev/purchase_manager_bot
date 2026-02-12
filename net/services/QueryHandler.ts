import TelegramBot, {CallbackQuery} from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";
import {DataProcessor} from "./DataProcessor";
import {Formatter} from "../utils/Formatter";
import {StateManager} from "./StateManager";
import {Purchase} from "../models/Purchase";

export class QueryHandler {

    constructor(
        private bot: TelegramBot,
        private dataProcessor: DataProcessor,
        private stateManager: StateManager
    ) {
    }

    async handle(query: CallbackQuery): Promise<void> {
        try {
            if (!query) return;
            if (!query.message) return;

            const chatId = query.message.chat.id;
            const messageId = query.message.message_id;
            const queryData = query.data;
            const queryId = query.id;

            Logger.debug("Query received", getContext(this), queryData)

            Logger.debug(`${queryData?.includes("purchase_confirm")}`);

            if (queryData?.includes("purchase_confirm")) {
                await this.handleConfirm(chatId, messageId, queryData, queryId);
            }

            switch (queryData) {
                case "command_list":
                    await this.handleQueryList(chatId, messageId, queryId);
                    break;
                case "purchase_edit":
                    break;
                case "purchase_cancel":
                    break;
                case "purchase_add_more":
                    break;
            }


        } catch (err) {
            Logger.error("An error occurred while handling the callback", getContext(this), query.message);
        }
    }

    private async handleQueryList(chatId: number, messageId: number, queryId: string): Promise<void> {
        await this.bot.editMessageText(
            "/help - instruction for use\n /ref - get referral link\n /options - bot options\n" +
            "/add - create purchase\n /history - your purchase history",
            {
                chat_id: chatId,
                message_id: messageId,
            });

        await this.answer(queryId);
    }

    private async handleConfirm(chatId: number, messageId: number, queryData: string, queryId: string) {
        const userId: number = Formatter.getUserId(queryData);

        Logger.debug(`${userId}`, getContext(this));

        if (userId === 0) {
            Logger.warn("User id is 0", getContext(this));
            await this.bot.sendMessage(chatId, "I'm so sorry, I have a problem. Try again later");
            return;
        }
        
        const purchase: Purchase | null = this.stateManager.completeFlow(userId, chatId);
        if (!purchase) {
            Logger.warn("State is undefined", getContext(this));
            await this.bot.sendMessage(chatId, "I'm so sorry, I have a problem. Try again later");
            return;
        }

        try {
            await this.dataProcessor.addPurchase(purchase);
        } catch (err) {
            Logger.error("A purchase saving error", getContext(this), err);
            await this.bot.sendMessage(chatId, "There is en error, please try again");
        }

        await this.bot.sendMessage(chatId, "I added the purchase");
        await this.answer(queryId);
    }

    private async answer(queryId: string): Promise<void> {
        await this.bot.answerCallbackQuery(queryId);
    }
}