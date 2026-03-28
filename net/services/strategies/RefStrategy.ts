import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";
import TelegramBot from "node-telegram-bot-api";

export class RefStrategy extends BaseStrategy {
    constructor(bot: TelegramBot) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        const link = `${process.env.URL_TO_BOT}?start=ref_${input.userId}`;
        await this.bot.sendMessage(input.chatId, `Your referral link: ${link}`);
    }

    async canHandle(event:IInputSource): Promise<Optional<boolean>> {
        if (event.text)
            return event.text === '/ref';
        return false;
    }
}