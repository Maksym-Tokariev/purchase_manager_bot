import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";
import TelegramBot from "node-telegram-bot-api";

export class HelpStrategy extends BaseStrategy {
    constructor(bot: TelegramBot) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        await this.bot.sendMessage(input.chatId,
            "Send purchase detail using /add, next follow the instruction"
        );
    }

    async canHandle(input: IInputSource): Promise<Optional<boolean>> {
        if (input.text)
            return input.text.toLowerCase() === 'help' || input.text === '/help';

        if (input.data)
            return input.data.includes('help');
    }

}