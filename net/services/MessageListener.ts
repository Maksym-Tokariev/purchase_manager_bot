import TelegramBot, {Message} from "node-telegram-bot-api";
import {Bot} from "../Bot";
import {CommandHandler} from "./CommandHandler";
import {MessageHandler} from "./MessageHandler";
import {MessageSender} from "./MessageSender";
import {MongoService} from "./MongoService";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";
import {PurchaseFlowService} from "./PurchaseFlowService";
import {StateManager} from "./StateManager";
import {StepHandler} from "./StepHandler";

export class MessageListener {
    private bot: TelegramBot
    private commandHandler: CommandHandler;
    private readonly stateManager: StateManager;
    private readonly stepHandler: StepHandler;
    private readonly purchaseFlowService: PurchaseFlowService;
    private readonly messageSender: MessageSender;

    constructor(
        bot: Bot,
        private mongo: MongoService
    ) {
        this.bot = bot.getTelegramBot();
        this.messageSender = new MessageSender(bot.getTelegramBot());
        this.stateManager = new StateManager();
        this.stepHandler = new StepHandler();
        this.purchaseFlowService = new PurchaseFlowService(bot.getTelegramBot(), this.messageSender, this.stateManager, this.stepHandler);
        this.commandHandler = new CommandHandler(this.messageSender, bot.getTelegramBot(), this.purchaseFlowService, this.mongo);
        Logger.info("MessageListener has been initialized", getContext(this));
        this.listen();
    }

    private async listen(): Promise<void> {
        try {
            Logger.debug("Start listening", getContext(this));
            this.bot.on('message', async (msg: Message): Promise<void> => {
                if (msg.text && msg.text.startsWith("/")) {
                    await this.commandHandler.handle(msg);
                } else if (msg.from?.id && msg.text) {
                    await this.purchaseFlowService.handleUserMessage(msg.from?.id, msg.text);
                }
            });
        } catch (err) {
           Logger.error("Message error: ", getContext(this), err);
        }
    }
}