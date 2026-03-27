import TelegramBot from "node-telegram-bot-api";
import {StateManager} from "../StateManager";
import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";

export class CancelStrategy extends BaseStrategy {

     constructor(
         bot: TelegramBot,
         private state: StateManager
     ) {
          super(bot);
     }

     async handle(input: IInputSource): Promise<void> {
          const queryId = input.queryId;
          const userId = input.userId!;
          const chatId = input.chatId;

          if (queryId && !this.state.isInFlow(userId)) {
               await this.bot.answerCallbackQuery(queryId);
               return;
          }

          if (!this.state.isInFlow(userId)) {
               await this.reply(input, "No active purchase to cancel");
               return;
          }

          this.state.cancelFlow(userId, chatId);

          if (input.type === "callback") {
               await this.bot.editMessageText("The addition has been canceled", {chat_id: chatId, message_id: input.messageId});
          } else {
               await this.reply(input, "❌ Purchase cancelled");
          }
          await this.answerQuery(input);
     }

     async canHandle(event: IInputSource): Promise<Optional<boolean>> {
          const text = event.text;

          if (!event.data) {
               return text === '/cancel' ||
                   text?.toLowerCase() === 'cancel';
          }
          return event.data.includes('purchase_cancel');
     }


}