import TelegramBot, {CallbackQuery} from "node-telegram-bot-api";
import {Logger} from "../../utils/Logger";
import {DataProcessor} from "../DataProcessor";
import {Formatter} from "../../utils/Formatter";
import {StateManager} from "../StateManager";
import {Purchase} from "../../models/Purchase";
import {Keyboards} from "../../keyboards/Keyboards";
import {PurchaseFlowService} from "../PurchaseFlowService";

export class QueryHandler {

    constructor(
        private bot: TelegramBot,
        private dataProcessor: DataProcessor,
        private state: StateManager,
        private flow: PurchaseFlowService
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

            Logger.debug(this, "Query received", queryData)

            if (queryData?.includes("purchase_confirm")) {
                await this.handleConfirm(chatId, messageId, queryData, queryId);
            }
            if (queryData?.includes("delete")) {
                await this.handleDelete(chatId, queryId, queryData);
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
                case "today":
                case "yesterday":
                    await this.handleDate(chatId, userId, queryId, queryData);

            }
        } catch (err) {
            Logger.error(this, "An error occurred while handling the callback", query.message);
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

        void this.answer(queryId);
    }

    private async handleConfirm(chatId: number, messageId: number, queryData: string, queryId: string) {
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
            await this.dataProcessor.addPurchase(purchase);
        } catch (err) {
            Logger.error(this, "A purchase saving error", err);
            await this.bot.sendMessage(chatId, "There is en error, please try again");
        }

        await this.bot.editMessageText("✅ I added the purchase", {
            chat_id: chatId,
            message_id: messageId
        });

        void this.answer(queryId);
    }

    private async answer(queryId: string): Promise<void> {
        await this.bot.answerCallbackQuery(queryId);
    }

    private async handleCancel(chatId: number, messageId: number, userId: number, queryId: string): Promise<void> {
        if (queryId && !this.state.isInFlow(userId)) {
            void this.answer(queryId);
            return;
        }
        this.state.cancelFlow(userId, chatId);
        await this.bot.editMessageText("The addition has been canceled", {chat_id: chatId, message_id: messageId});
        void this.answer(queryId);
    }

    private async handleAddCategory(chatId: number, userId: number, queryId: string): Promise<void> {
        await this.bot.sendMessage(chatId, "You can add a category to the purchase, and I'll group your purchases by category in further analysis. Enter category", {
            reply_markup: Keyboards.getAddCategoryKeyboard()

        });
    }

    private async handleDate(chatId: number, userId: number, queryId: string, queryData: string): Promise<void> {
        await this.flow.handleFlow(userId, chatId, queryData);
        void this.answer(queryId);
    }

    private async handleDelete(chatId: number, queryId: string, queryData: string | undefined): Promise<void> {
        if (!queryData) return;
        const purchaseId = Formatter.getPurchaseId(queryData);
        const res = await this.dataProcessor.deletePurchase(purchaseId);

        if (res?.acknowledged) {
            await this.bot.sendMessage(chatId, "The purchase has been deleted");
            void this.answer(queryId);
            return
        }

        await this.bot.sendMessage(chatId, "Delete error");
        void this.answer(queryId);
    }

    private async handleEdit(chatId: number, queryId: string, queryData: string | undefined): Promise<void> {

    }
}