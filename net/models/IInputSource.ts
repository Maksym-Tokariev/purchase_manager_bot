import {CallbackQuery, Message, User} from "node-telegram-bot-api";

export interface IInputSource {
    get userId(): Optional<number>;
    get chatId(): number;
    get message(): Optional<Message>;
    get messageId(): Optional<number>;
    get from(): Optional<Optional<User>>
    get text(): Optional<string>;
    get data(): Optional<string>;
    get queryId(): Optional<string>;
    get original(): Message | CallbackQuery;
    get type(): 'message' | 'callback';
    get command(): Optional<string>;
    isCommand(): boolean;
}