import {CallbackQuery, Message} from "node-telegram-bot-api";

export interface IInputSource {
    getUserId(): number | undefined;
    getChatId(): number;
    getMessageId(): number | undefined;
    getText(): string | undefined;
    getData(): string | undefined;
    getQueryId(): string | undefined;
    getOriginal(): Message | CallbackQuery;
    getType(): 'message' | 'callback';
    isCommand(): boolean;
    getCommand(): string | undefined;
}