import {QueryStrategy} from "../interfaces/QueryStrategy";
import TelegramBot from "node-telegram-bot-api";
import {StateManager} from "../StateManager";

export class CancelStrategy implements QueryStrategy {

     constructor(
         private bot: TelegramBot,
         private state: StateManager
     ) {}

     async handle(query: TelegramBot.CallbackQuery): Promise<void> {
          if (query.id && !this.state.isInFlow(query.from.id)) {
               void this.bot.answerCallbackQuery(query.id);
               return;
          }
          this.state.cancelFlow(query.from.id, query.message?.chat.id!);
          await this.bot.editMessageText("The addition has been canceled", {chat_id: query.message?.chat.id, message_id: query.message?.message_id});
          void this.bot.answerCallbackQuery(query.id);
     }
}