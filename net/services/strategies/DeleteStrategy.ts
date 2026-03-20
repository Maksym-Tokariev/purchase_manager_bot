import {IStrategy} from "../interfaces/IStrategy";
import TelegramBot from "node-telegram-bot-api";
import {Formatter} from "../../utils/Formatter";
import {DataProcessor} from "../DataProcessor";

export class DeleteStrategy implements IStrategy{
    constructor(private bot: TelegramBot, private data: DataProcessor) {}

    async handle(query: TelegramBot.CallbackQuery): Promise<void> {
        if (!query.data) return;
        const purchaseId = Formatter.getPurchaseId(query.data);
        const res = await this.data.deletePurchase(purchaseId);

        if (res?.acknowledged) {
            await this.bot.sendMessage(query.message?.chat.id!, "The purchase has been deleted");
            void this.bot.answerCallbackQuery(query.id);
            return
        }

        await this.bot.sendMessage(query.message?.chat.id!, "Delete error");
        void this.bot.answerCallbackQuery(query.id);
    }
}