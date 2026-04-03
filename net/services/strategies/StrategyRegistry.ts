import {IStrategy} from "../interfaces/IStrategy";
import {CancelStrategy} from "./CancelStrategy";
import TelegramBot from "node-telegram-bot-api";
import {DataProcessor} from "../DataProcessor";
import {StateManager} from "../StateManager";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {MessageSender} from "../MessageSender";
import {DeleteStrategy} from "./DeleteStrategy";
import {ConfirmStrategy} from "./ConfirmStrategy";
import {EditStrategy} from "./EditStrategy";
import {ShowCommandListStrategy} from "./ShowCommandListStrategy";
import {DateStrategy} from "./DateStrategy";
import {AddStrategy} from "./AddStrategy";
import {AddCategoryStrategy} from "./AddCategoryStrategy";
import {HistoryStrategy} from "./HistoryStrategy";
import {StartStrategy} from "./StartStrategy";
import {HelpStrategy} from "./HelpStrategy";
import {RefStrategy} from "./RefStrategy";
import {OptionStrategy} from "./OptionStrategy";

export class StrategyRegistry {
    private readonly _strategies: Set<IStrategy> = new Set<IStrategy>();

    constructor(
        private bot: TelegramBot,
        private data: DataProcessor,
        private state: StateManager,
        private flow: PurchaseFlowService,
        private sender: MessageSender,
    ) {
        this._strategies.add(new CancelStrategy(bot, this.state));
        this._strategies.add(new DeleteStrategy(bot, this.data));
        this._strategies.add(new ConfirmStrategy(bot, this.state, this.data));
        this._strategies.add(new EditStrategy(bot, this.flow, this.data));
        this._strategies.add(new ShowCommandListStrategy(this.bot));
        this._strategies.add(new DateStrategy(bot, this.flow));
        this._strategies.add(new AddStrategy(bot, this.flow));
        this._strategies.add(new AddCategoryStrategy(this.bot));
        this._strategies.add(new HistoryStrategy(bot, this.data, this.sender));
        this._strategies.add(new StartStrategy(bot));
        this._strategies.add(new HelpStrategy(bot));
        this._strategies.add(new RefStrategy(bot));
        this._strategies.add(new OptionStrategy(bot));
    }

    get strategies(): Set<IStrategy> {
        return this._strategies;
    }
}