import {IStrategy} from "../interfaces/IStrategy";
import {CancelStrategy} from "../strategies/CancelStrategy";
import {DeleteStrategy} from "../strategies/DeleteStrategy";
import {ConfirmStrategy} from "../strategies/ConfirmStrategy";
import {EditStrategy} from "../strategies/EditStrategy";
import {ShowCommandListStrategy} from "../strategies/ShowCommandListStrategy";
import {DateStrategy} from "../strategies/DateStrategy";
import {AddStrategy} from "../strategies/AddStrategy";
import {AddCategoryStrategy} from "../strategies/AddCategoryStrategy";
import {HistoryStrategy} from "../strategies/HistoryStrategy";
import TelegramBot from "node-telegram-bot-api";
import {DataProcessor} from "../DataProcessor";
import {StateManager} from "../StateManager";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {MessageSender} from "../MessageSender";
import {IInputSource} from "../../models/IInputSource";

export class StrategyFactory {
    private strategies: IStrategy[] = [];

    constructor(
        private bot: TelegramBot,
        private data: DataProcessor,
        private state: StateManager,
        private flow: PurchaseFlowService,
        private sender: MessageSender
    ) {
        this.strategies = [
            new CancelStrategy(this.bot, this.state),
            new DeleteStrategy(this.bot, this.data),
            new ConfirmStrategy(this.bot, this.state, this.data),
            new EditStrategy(this.bot, this.flow, this.data),
            new ShowCommandListStrategy(this.bot),
            new DateStrategy(this.bot, this.flow),
            new AddStrategy(this.bot, this.flow),
            new AddCategoryStrategy(this.bot),
            new HistoryStrategy(this.bot, this.data, this.sender)
        ];
    }

    findStrategy(input: IInputSource) {

    }
}