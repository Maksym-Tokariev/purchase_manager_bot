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
        const chatId = input.getChatId();
        const userId = input.getUserId()!;

        await this.flow.startAddFlow(userId, chatId);
        await this.answerQuery(input);
    }

    canHandle(input: IInputSource): boolean | undefined {
        const text = input.getText();
        const data = input.getData();

        return text === '/add' ||
            text?.toLowerCase() === 'Add' ||
            data === 'purchase_cancel' ||
            data?.includes('cancel');
    }

}