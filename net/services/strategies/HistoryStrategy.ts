import TelegramBot from "node-telegram-bot-api";
import {PurchaseDTO} from "../../models/PurchaseDTO";
import {config} from "../../config/Config";
import {DataProcessor} from "../DataProcessor";
import {MessageSender} from "../MessageSender";
import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";

export class HistoryStrategy extends BaseStrategy{

    constructor(
        bot: TelegramBot,
        private data: DataProcessor,
        private sender: MessageSender
    ) {
        super(bot);
    }

    async handle(event: IInputSource): Promise<void> {
        if (!event.message) return;
        const chatId = event.message.chat.id;
        const userId = event.userId!;

        const data: PurchaseDTO[] = await this.data.getLastPurchases(userId, config.history_limit);
        await this.sender.sendHistory(chatId, data);

        if (event.queryId) {
            await this.bot.answerCallbackQuery(event.queryId);
        }
    }


    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.text) {
            return event.text.toLowerCase() === 'history' ||
                event.text.toLowerCase() === '/history'
        }
        return false;
    }
}