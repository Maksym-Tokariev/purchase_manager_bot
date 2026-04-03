import TelegramBot from "node-telegram-bot-api";
import {Formatter} from "../../utils/Formatter";
import {DepLogger} from "../../utils/DepLogger";
import {Purchase} from "../../models/Purchase";
import {StateManager} from "../StateManager";
import {DataProcessor} from "../DataProcessor";
import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";
import {Logger} from "../../utils/Logger";
import {Keyboards} from "../../keyboards/Keyboards";

export class ConfirmStrategy extends BaseStrategy {
    private logger = new Logger(ConfirmStrategy.name);
    constructor(
        bot: TelegramBot,
        private state: StateManager,
        private data: DataProcessor
    ) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        if (!input.message) return;
        if (!input.data) return;

        const chatId = input.message.chat.id;
        const messageId = input.message.message_id;
        const queryData = input.data;
        const queryId = input.queryId;

        const userId: number = Formatter.getId(queryData);

        DepLogger.debug(this, `UserId : ${userId}, queryId : ${queryId}`);

        if (userId === 0) {
            DepLogger.warn(this, "User id is 0");
            await this.bot.sendMessage(chatId, "I'm so sorry, I have a problem. Try again later");
            return;
        }

        const purchase: Purchase | null = this.state.completeFlow(userId, chatId);
        if (!purchase) {
            DepLogger.warn(this, "State is undefined");
            await this.bot.sendMessage(chatId, "I'm so sorry, I have a problem. Try again later");
            return;
        }

        try {
            await this.data.addPurchase(purchase);
        } catch (err) {
            DepLogger.error(this, "A purchase saving error", err);
            await this.bot.sendMessage(chatId, "There is en error, please try again");
        }

        await this.bot.editMessageText("✅ I added the purchase", {
            reply_markup: Keyboards.getCompletedAddKeyboard(userId),
            chat_id: chatId,
            message_id: messageId
        });

        if (queryId) {
            void this.bot.answerCallbackQuery(queryId);
        }
    }


    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (!event.data) {
            return;
        }
        return event.data.includes('add:');
    }
}