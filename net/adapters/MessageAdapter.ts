import {IInputSource} from "../models/IInputSource";
import {Message} from "node-telegram-bot-api";

export class MessageAdapter implements IInputSource {
    constructor(private message: Message) {}

    getUserId(): number | undefined {
        return this.message.from?.id;
    }

    getChatId(): number {
        return this.message.chat.id;
    }

    getMessageId(): number | undefined {
        return this.message.message_id;
    }

    getText(): string | undefined {
        return this.message.text;
    }

    getData(): string | undefined {
        return undefined;
    }

    getQueryId(): string | undefined {
        return undefined;
    }

    getOriginal(): Message {
        return this.message;
    }

    getType(): 'message' | 'callback' {
        return 'message';
    }

    isCommand(): boolean {
        return this.message.text?.startsWith('/') ?? false;
    }

    getCommand(): string | undefined {
        return this.isCommand() ? this.message.text?.split(' ')[0] : undefined;
    }
}