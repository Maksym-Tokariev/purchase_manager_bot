import {IInputSource} from "../models/IInputSource";
import TelegramBot, {CallbackQuery} from "node-telegram-bot-api";

export class CallbackAdapter implements IInputSource {
    constructor(private query: CallbackQuery) {}

    get userId(): Optional<number> {
        return this.query.from.id;
    }

    get chatId(): number {
        return this.query.message?.chat.id!;
    }

    get message(): Optional<TelegramBot.Message> {
        return this.query.message;
    }

    get messageId(): Optional<number> {
        return this.query.message?.message_id;
    }

    get text(): Optional<string> {
        return undefined;
    }

    get data(): Optional<string> {
        return this.query.data;
    }

    get queryId(): Optional<string> {
        return this.query.id;
    }

    get original(): CallbackQuery {
        return this.query;
    }

    get type(): 'message' | 'callback' {
        return 'callback';
    }

    isCommand(): boolean {
        return false;
    }

    get command(): Optional<string> {
        return undefined;
    }
}