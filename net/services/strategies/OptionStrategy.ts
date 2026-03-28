import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";
import TelegramBot from "node-telegram-bot-api";

export class OptionStrategy extends BaseStrategy {
    constructor(bot: TelegramBot) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        await this.bot.sendMessage(input.chatId, "The command is not ready yet");
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.text)
            return event.text === '/options';
        return false;
    }
}