import {CallbackQuery} from "node-telegram-bot-api";

export interface QueryStrategy {
    handle(query: CallbackQuery): Promise<void>;
}