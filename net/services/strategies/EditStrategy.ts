import {IStrategy} from "../interfaces/IStrategy";
import TelegramBot from "node-telegram-bot-api";
import {Formatter} from "../../utils/Formatter";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {DataProcessor} from "../DataProcessor";

export class EditStrategy implements IStrategy {
    constructor(
        private bot: TelegramBot,
        private flow: PurchaseFlowService,
        private data: DataProcessor
    ) {}

    async handle(query: TelegramBot.CallbackQuery): Promise<void> {
        if (!query.data) return;
        const id = Formatter.getPurchaseId(query.data);
        const purchase = await this.data.getPurchase(id);

        if (!purchase) {
            await this.bot.answerCallbackQuery(query.id, {text: "edit error"});
            return;
        }
        await this.flow.startEditFlow(query.from.id, query.message?.chat.id!);
        await this.bot.answerCallbackQuery(query.id);
    }
}