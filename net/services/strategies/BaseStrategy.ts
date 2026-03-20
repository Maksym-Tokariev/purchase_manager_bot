import {IStrategy} from "../interfaces/IStrategy";
import {IInputSource} from "../../models/IInputSource";
import TelegramBot from "node-telegram-bot-api";

export abstract class BaseStrategy implements IStrategy {
    protected constructor(protected bot: TelegramBot) {}

    abstract canHandle(input: IInputSource): boolean | undefined;
    abstract handle(input: IInputSource): Promise<void>;

    protected async reply(input: IInputSource, text: string, options?: any): Promise<void> {
        await this.bot.sendMessage(input.getChatId(), text, options);

        if (input.getQueryId()) {
            await this.bot.answerCallbackQuery(input.getQueryId()!);
        }
    }

    protected async answerQuery(input: IInputSource, text?: string): Promise<void> {
        const queryId: string | undefined = input.getQueryId();
        if (queryId) {
            await this.bot.answerCallbackQuery(queryId, { text });
        }
    }
}