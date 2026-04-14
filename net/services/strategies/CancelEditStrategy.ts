import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";
import TelegramBot from "node-telegram-bot-api";
import {StateManager} from "../StateManager";

export class CancelEditStrategy extends BaseStrategy {
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
            await this.answerQuery(input);
            return;
        }
        this.state.cancelFlow(userId, chatId);

        if (input.type === "callback") {
            await this.bot.editMessageText("The editing has been canceled", {chat_id: chatId, message_id: input.messageId});
        } else {
            await this.reply(input, "❌ Edit cancelled");
        }
        await this.answerQuery(input);
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.type === 'message') return;
        return event.data === 'cancel_edit';
    }
}