import TelegramBot from "node-telegram-bot-api";
import {Formatter} from "../../utils/Formatter";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {DataProcessor} from "../DataProcessor";
import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";
import {StrategyError} from "../../errors/StrategyError";
import {Logger} from "../../utils/Logger";

export class EditInputStrategy extends BaseStrategy{
    private readonly logger = new Logger(EditInputStrategy.name);
    constructor(
        bot: TelegramBot,
        private flow: PurchaseFlowService,
        private data: DataProcessor
    ) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        if (!input.data) return;
        await this.flow.startEditFlow(input.userId!, input.message?.chat.id!);
        await this.bot.answerCallbackQuery(input.queryId!);
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.type === 'message')
            return;
        return event.data!.includes('purchase_edit');
    }
}