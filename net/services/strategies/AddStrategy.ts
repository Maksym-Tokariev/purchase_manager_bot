import TelegramBot from "node-telegram-bot-api";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {IInputSource} from "../../models/IInputSource";
import {BaseStrategy} from "./BaseStrategy";
import {Logger} from "../../utils/Logger";

export class AddStrategy extends BaseStrategy {
    private logger = new Logger(AddStrategy.name);

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

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (!event.data) {
            return event.text === '/add' || event.text === 'Add';
        }
        return event.data.includes('add:');
    }

}