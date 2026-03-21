import {IStrategy} from "../interfaces/IStrategy";
import TelegramBot from "node-telegram-bot-api";
import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";

export class ShowCommandListStrategy extends BaseStrategy{
    constructor(bot: TelegramBot) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        await this.bot.editMessageText(
            "/help - instruction for use\n /ref - get referral link\n /options - bot options\n" +
            "/add - create purchase\n /history - your purchase history",
            {
                chat_id: input.message?.chat.id,
                message_id: input.message?.message_id,
            });
        void this.bot.answerCallbackQuery(input.queryId!);
    }


    canHandle(input: IInputSource): Optional<boolean> {
        return undefined;
    }
}