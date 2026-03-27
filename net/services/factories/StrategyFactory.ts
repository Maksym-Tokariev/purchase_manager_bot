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
import {EventListener} from "../../utils/EventListener";
import {EventManager} from "../EventManager";
import {Logger} from "../../utils/Logger";

export class StrategyFactory implements EventListener {
    private logger = new Logger(StrategyFactory.name);
    private strategies: IStrategy[] = [];

    constructor(
        private bot: TelegramBot,
        private data: DataProcessor,
        private state: StateManager,
        private flow: PurchaseFlowService,
        private sender: MessageSender,
        private event: EventManager
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

    async findStrategy(event: IInputSource) {
        this.logger.debug('Search for a strategy');
        this.logger.debug(`${event.text}`);
        for (const strategy of this.strategies) {
            if (await strategy.canHandle(event)) {
                this.logger.debug('A strategy has been found');
                await strategy.handle(event);
                return;
            }
        }
        this.logger.warn('Strategy not found');
    }

    async update(event: IInputSource): Promise<void> {
        this.logger.debug('Update strategy factory');
        await this.findStrategy(event);
    }

    async subscribe() {
        await this.event.subscribe(this);
    }
}