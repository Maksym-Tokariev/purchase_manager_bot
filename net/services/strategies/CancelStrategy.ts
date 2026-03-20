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
          const queryId = input.getQueryId();
          const userId = input.getUserId()!;
          const chatId = input.getChatId();

          if (queryId && !this.state.isInFlow(userId)) {
               void this.bot.answerCallbackQuery(queryId);
               return;
          }

          if (!this.state.isInFlow(userId)) {
               await this.reply(input, "No active purchase to cancel");
               return;
          }

          this.state.cancelFlow(userId, chatId);

          if (input.getType() === "callback") {
               await this.bot.editMessageText("The addition has been canceled", {chat_id: chatId, message_id: input.getMessageId()});
          } else {
               await this.reply(input, "❌ Purchase cancelled")
          }
          await this.answerQuery(input);
     }

     canHandle(input: IInputSource): boolean | undefined {
          const text = input.getText();
          const data = input.getData();

          return text === '/cancel' ||
              text?.toLowerCase() === 'cancel' ||
              data === 'purchase_cancel' ||
              data?.includes('cancel');
     }


}