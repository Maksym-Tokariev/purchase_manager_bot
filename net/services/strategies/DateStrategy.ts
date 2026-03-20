import {IStrategy} from "../interfaces/IStrategy";
import TelegramBot from "node-telegram-bot-api";
import {PurchaseFlowService} from "../PurchaseFlowService";

export class DateStrategy implements IStrategy {
    constructor(private bot: TelegramBot, private flow: PurchaseFlowService) {}

    async handle(query: TelegramBot.CallbackQuery): Promise<void> {
        if (!query.message) return;
        await this.flow.handleFlow(query.from.id, query.message?.chat.id, query.data!);
        void this.bot.answerCallbackQuery(query.id);
    }
}