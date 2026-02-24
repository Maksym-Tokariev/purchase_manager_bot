import TelegramBot, {CallbackQuery} from "node-telegram-bot-api";
import {Logger} from "../../utils/Logger";
import {DataProcessor} from "../DataProcessor";
import {StateManager} from "../StateManager";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {MessageSender} from "../MessageSender";
import {QueryStrategyFactory} from "../factory/QueryStrategyFactory";

export class QueryHandler {
    private factory: QueryStrategyFactory;

    constructor(
        private bot: TelegramBot,
        private data: DataProcessor,
        private state: StateManager,
        private flow: PurchaseFlowService,
        private sender: MessageSender
    ) {
        this.factory = new QueryStrategyFactory(
            this.bot,
            this.data,
            this.state,
            this.flow,
            this.sender
        );
    }

    async handle(query: CallbackQuery): Promise<void> {
        try {
            if (!query) return;
            const strategies = this.factory.getStrategies();
            if ( strategies === undefined) return;

            for (const [key, strategy] of strategies) {
                if (query.data?.includes(key)) {
                    await strategy.handle(query);
                    return;
                }
            }
            await this.handleDefault(query);
        } catch (err) {
            Logger.error(this, "An error occurred while handling the callback", query.message);
        }
    }

    private async handleDefault(query: TelegramBot.CallbackQuery) {
        await this.bot.answerCallbackQuery(query.id, {text: "This function is not ready yet"});
    }
}