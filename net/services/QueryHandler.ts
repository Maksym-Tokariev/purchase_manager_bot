import TelegramBot, {CallbackQuery} from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";
import {DataProcessor} from "./DataProcessor";
import {Formatter} from "../utils/Formatter";
import {StateManager} from "./StateManager";
import {Purchase} from "../models/Purchase";
import {Keyboards} from "../keyboards/Keyboards";

export class QueryHandler {

    constructor(
        private bot: TelegramBot,
        private dataProcessor: DataProcessor,
        private stateManager: StateManager
    ) {}

    async handle(query: CallbackQuery): Promise<void> {
        try {
            if (!query) return;
            if (!query.message) return;

            const chatId = query.message.chat.id;
            const messageId = query.message.message_id;
            const queryData = query.data;
            const queryId = query.id;
            const userId = query.from.id;

            Logger.debug("Query received", getContext(this), queryData)

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
                    await this.handleCancel(chatId, messageId, userId, queryId);
                    break;
                case "purchase_add_category":
                    await this.handleAddCategory(chatId, userId, queryId);
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

        await this.bot.editMessageText("✅ I added the purchase", {
            chat_id: chatId,
            message_id: messageId
        });

        await this.answer(queryId);
    }

    private async answer(queryId: string): Promise<void> {
        await this.bot.answerCallbackQuery(queryId);
    }

    private async handleCancel(chatId: number, messageId: number, userId: number, queryId: string): Promise<void> {
        this.stateManager.cancelFlow(userId, chatId);
        await this.bot.editMessageText("The addition has been canceled", {chat_id: chatId, message_id: messageId});
        await this.answer(queryId);
    }

    private async handleAddCategory(chatId: number, userId: number, queryId: string): Promise<void> {
        await this.bot.sendMessage(chatId, "You can add a category to the purchase, and I'll group your purchases by category in further analysis. Enter category", {
            reply_markup: {
                inline_keyboard: Keyboards.getAddCategoryKeyboard()
            }
        });
    }
}