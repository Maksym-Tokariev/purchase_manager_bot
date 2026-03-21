import TelegramBot from "node-telegram-bot-api";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {IInputSource} from "../../models/IInputSource";
import {BaseStrategy} from "./BaseStrategy";

export class AddStrategy extends BaseStrategy {
    constructor(
        bot: TelegramBot,
        private flow: PurchaseFlowService
    ) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        const chatId = input.chatId;
        const userId = input.userId!;

        await this.flow.startAddFlow(userId, chatId);
        await this.answerQuery(input);
    }

    canHandle(input: IInputSource): boolean | undefined {
        const text = input.text;

        return text === '/add' ||
            text?.toLowerCase() === 'Add';
    }

}