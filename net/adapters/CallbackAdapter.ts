import {IInputSource} from "../models/IInputSource";
import {CallbackQuery} from "node-telegram-bot-api";

export class CallbackAdapter implements IInputSource {
    constructor(private query: CallbackQuery) {}

    getUserId(): number | undefined {
        return this.query.from.id;
    }

    getChatId(): number {
        return this.query.message?.chat.id!;
    }

    getMessageId(): number | undefined {
        return this.query.message?.message_id;
    }

    getText(): string | undefined {
        return undefined;
    }

    getData(): string | undefined {
        return this.query.data;
    }

    getQueryId(): string | undefined {
        return this.query.id;
    }

    getOriginal(): CallbackQuery {
        return this.query;
    }

    getType(): 'message' | 'callback' {
        return 'callback';
    }

    isCommand(): boolean {
        return false; // CallbackQuery не может быть командой
    }

    getCommand(): string | undefined {
        return undefined;
    }
}