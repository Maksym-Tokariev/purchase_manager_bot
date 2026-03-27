import TelegramBot from "node-telegram-bot-api";
import {Formatter} from "../../utils/Formatter";
import {DataProcessor} from "../DataProcessor";
import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";
import {DeleteResult} from "mongodb";

export class DeleteStrategy extends BaseStrategy {
    constructor(
        bot: TelegramBot,
        private data: DataProcessor
    ) {
        super(bot);
    }

    async handle(query: IInputSource): Promise<void> {
        if (!query.data) return;
        const purchaseId = Formatter.getPurchaseId(query.data);
        const res: Optional<DeleteResult> = await this.data.deletePurchase(purchaseId);

        if (res?.acknowledged) {
            await this.bot.sendMessage(query.message?.chat.id!, "The purchase has been deleted");
            void this.bot.answerCallbackQuery(query.queryId!);
            return
        }

        await this.bot.sendMessage(query.message?.chat.id!, "Delete error");
        void this.bot.answerCallbackQuery(query.queryId!);
    }


    canHandle(event: IInputSource): Optional<boolean> {
        if (event.type === 'callback')
            return event.data!.includes('delete:');
        return false;
    }
}