import TelegramBot, {CallbackQuery, Message} from "node-telegram-bot-api";
import {Bot} from "../Bot";
import {CommandHandler} from "./CommandHandler";
import {MessageSender} from "./MessageSender";
import {MongoService} from "./MongoService";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";
import {PurchaseFlowService} from "./PurchaseFlowService";
import {StateManager} from "./StateManager";
import {StepHandler} from "./StepHandler";
import {QueryHandler} from "./QueryHandler";

export class MessageListener {
    private readonly commandHandler: CommandHandler;
    private readonly bot: TelegramBot
    private readonly stateManager: StateManager;
    private readonly stepHandler: StepHandler;
    private readonly purchaseFlowService: PurchaseFlowService;
    private readonly messageSender: MessageSender;
    private readonly queryHandler: QueryHandler;

    constructor(
        bot: Bot,
        private mongo: MongoService
    ) {
        this.bot = bot.getTelegramBot();
        this.messageSender = new MessageSender(this.bot);
        this.stateManager = new StateManager();
        this.stepHandler = new StepHandler();
        this.purchaseFlowService = new PurchaseFlowService(this.bot, this.messageSender, this.stateManager, this.stepHandler);
        this.commandHandler = new CommandHandler(this.messageSender, this.bot, this.purchaseFlowService, this.mongo);
        this.queryHandler = new QueryHandler(this.bot);
        Logger.info("MessageListener has been initialized", getContext(this));
        this.listen();
    }

    private async listen(): Promise<void> {
        try {
            Logger.debug("Start listening", getContext(this));
            this.bot.on('message', async (msg: Message): Promise<void> => {
                if (msg.text && msg.text.startsWith("/")) {
                    try {
                        void this.commandHandler.handle(msg);
                    } catch (err) {
                        Logger.error("An error occurred while handling the command:", getContext(this), msg);
                    }
                } else if (msg.from?.id && msg.text) {
                    try {
                        void this.purchaseFlowService.handleUserMessage(msg.from?.id, msg.text);
                    } catch (err) {
                        Logger.error("An error occurred while handling the message:", getContext(this), msg);
                    }
                }
            });

            this.bot.on("callback_query", async (query: CallbackQuery) => {
                try {
                    void this.queryHandler.handle(query);
                } catch (err) {
                    Logger.error("An error occurred while handling the callback", getContext(this), query.message);
                }
            });
        } catch (err: any) {
           Logger.error("Message error: ", getContext(this), err);
        }
    }
}