import {IStrategy} from "../interfaces/IStrategy";
import TelegramBot, {CallbackQuery} from "node-telegram-bot-api";
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

    async handle(input: IInputSource): Promise<void> {
        if (!input.message) return;
        const chatId = input.message.chat.id;
        const userId = input.userId!;

        const data: PurchaseDTO[] = await this.data.getLastPurchases(userId, config.history_limit);
        await this.sender.sendHistory(chatId, data);
        void this.bot.answerCallbackQuery(input.queryId!);
    }


    canHandle(input: IInputSource): Optional<boolean> {
        return undefined;
    }
}