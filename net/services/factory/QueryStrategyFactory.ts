import {QueryStrategy} from "../interfaces/QueryStrategy";
import {CancelStrategy} from "../QueryStrategies/CancelStrategy";
import {DeleteStrategy} from "../QueryStrategies/DeleteStrategy";
import {ConfirmStrategy} from "../QueryStrategies/ConfirmStrategy";
import {EditStrategy} from "../QueryStrategies/EditStrategy";
import {ShowCommandListStrategy} from "../QueryStrategies/ShowCommandListStrategy";
import {DateStrategy} from "../QueryStrategies/DateStrategy";
import {AddStrategy} from "../QueryStrategies/AddStrategy";
import {AddCategoryStrategy} from "../QueryStrategies/AddCategoryStrategy";
import {HistoryStrategy} from "../QueryStrategies/HistoryStrategy";
import TelegramBot from "node-telegram-bot-api";
import {DataProcessor} from "../DataProcessor";
import {StateManager} from "../StateManager";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {MessageSender} from "../MessageSender";

export class QueryStrategyFactory {
    private strategies: Map<string, QueryStrategy> = new Map();

    constructor(
        private bot: TelegramBot,
        private data: DataProcessor,
        private state: StateManager,
        private flow: PurchaseFlowService,
        private sender: MessageSender
    ) {
        this.strategies.set("purchase_cancel", new CancelStrategy(this.bot, this.state));
        this.strategies.set("delete", new DeleteStrategy(this.bot, this.data));
        this.strategies.set("purchase_confirm", new ConfirmStrategy(this.bot, this.state, this.data));
        this.strategies.set("edit:", new EditStrategy(this.bot, this.flow, this.data));
        this.strategies.set("command_list", new ShowCommandListStrategy(this.bot));
        this.strategies.set("today", new DateStrategy(this.bot, this.flow));
        this.strategies.set("yesterday", new DateStrategy(this.bot, this.flow));
        this.strategies.set("add", new AddStrategy(this.bot, this.flow));
        this.strategies.set("purchase_add_category", new AddCategoryStrategy(this.bot));
        this.strategies.set("history", new HistoryStrategy(this.bot, this.data, this.sender));
    }

    public getStrategy(query: string): QueryStrategy | undefined {
        return this.strategies.get(query);
    }

    public getStrategies(): Map<string, QueryStrategy> | undefined {
        return this.strategies;
    }
}