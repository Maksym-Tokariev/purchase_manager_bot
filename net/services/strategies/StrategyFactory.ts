import {IStrategy} from "../interfaces/IStrategy";
import {CancelStrategy} from "./CancelStrategy";
import {DeleteStrategy} from "./DeleteStrategy";
import {ConfirmStrategy} from "./ConfirmStrategy";
import {EditStrategy} from "./EditStrategy";
import {ShowCommandListStrategy} from "./ShowCommandListStrategy";
import {DateStrategy} from "./DateStrategy";
import {AddStrategy} from "./AddStrategy";
import {AddCategoryStrategy} from "./AddCategoryStrategy";
import {HistoryStrategy} from "./HistoryStrategy";
import TelegramBot from "node-telegram-bot-api";
import {DataProcessor} from "../DataProcessor";
import {StateManager} from "../StateManager";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {MessageSender} from "../MessageSender";
import {IInputSource} from "../../models/IInputSource";
import {EventListener} from "../../utils/EventListener";
import {EventManager} from "../event/EventManager";
import {Logger} from "../../utils/Logger";
import {StartStrategy} from "./StartStrategy";
import {HelpStrategy} from "./HelpStrategy";
import {RefStrategy} from "./RefStrategy";

export class StrategyFactory implements EventListener {
    private readonly logger = new Logger(StrategyFactory.name);
    private readonly strategies: IStrategy[] = [];

    constructor(
        private bot: TelegramBot,
        private data: DataProcessor,
        private state: StateManager,
        private flow: PurchaseFlowService,
        private sender: MessageSender,
        private event: EventManager
    ) {
        this.strategies = [
            new CancelStrategy(bot, this.state),
            new DeleteStrategy(bot, this.data),
            new ConfirmStrategy(bot, this.state, this.data),
            new EditStrategy(bot, this.flow, this.data),
            new ShowCommandListStrategy(this.bot),
            new DateStrategy(bot, this.flow),
            new AddStrategy(bot, this.flow),
            new AddCategoryStrategy(this.bot),
            new HistoryStrategy(bot, this.data, this.sender),
            new StartStrategy(bot),
            new HelpStrategy(bot),
            new RefStrategy(bot)
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