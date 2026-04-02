import TelegramBot from "node-telegram-bot-api";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";

export class DateStrategy extends BaseStrategy{
    constructor(bot: TelegramBot, private flow: PurchaseFlowService) {
        super(bot);
    }

    async handle(query: IInputSource): Promise<void> {
        if (!query.message) return;
        await this.flow.handleFlow(query.userId!, query.message?.chat.id, query.data!);
        void this.bot.answerCallbackQuery(query.queryId!);
    }


    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.type === 'callback' || !event.text)
            return event.data === 'today' || event.data === 'yesterday';
        return event.text.toLowerCase() === 'today' || event.text.toLowerCase() === 'yesterday';
    }
}