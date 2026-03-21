import {IStrategy} from "../interfaces/IStrategy";
import {IInputSource} from "../../models/IInputSource";
import TelegramBot from "node-telegram-bot-api";

export abstract class BaseStrategy implements IStrategy {
    protected constructor(protected bot: TelegramBot) {}

    abstract canHandle(input: IInputSource): Optional<boolean>;
    abstract handle(input: IInputSource): Promise<void>;

    protected async reply(input: IInputSource, text: string, options?: any): Promise<void> {
        await this.bot.sendMessage(input.chatId, text, options);

        if (input.queryId) {
            await this.bot.answerCallbackQuery(input.queryId);
        }
    }

    protected async answerQuery(input: IInputSource, text?: string): Promise<void> {
        const queryId: string | undefined = input.queryId;
        if (queryId) {
            await this.bot.answerCallbackQuery(queryId, { text });
        }
    }
}