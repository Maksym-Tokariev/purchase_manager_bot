import {IInputSource} from "../models/IInputSource";
import TelegramBot, {Message, User} from "node-telegram-bot-api";

export class MessageAdapter implements IInputSource {
    constructor(private msg: Message) {}

    get message(): Optional<TelegramBot.Message> {
        return this.msg;
    }

    get userId(): number | undefined {
        return this.msg.from?.id;
    }

    get chatId(): number {
        return this.msg.chat.id;
    }

    get messageId(): number | undefined {
        return this.msg.message_id;
    }

    get text(): string | undefined {
        return this.msg.text;
    }

    get from(): Optional<Optional<User>> {
        return this.msg.from;
    }

    get data(): string | undefined {
        return undefined;
    }

    get queryId(): string | undefined {
        return undefined;
    }

    get original(): Message {
        return this.msg;
    }

    get type(): 'message' | 'callback' {
        return 'message';
    }

    isCommand(): boolean {
        return this.msg.text?.startsWith('/') ?? false;
    }

    get command(): string | undefined {
        return this.isCommand() ? this.msg.text?.split(' ')[0] : undefined;
    }
}