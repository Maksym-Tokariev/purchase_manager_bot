import {Bot} from "../Bot";
import {MongoService} from "../services/MongoService";
import {MessageSender} from "../services/MessageSender";
import {StateManager} from "../services/StateManager";
import {StepHandler} from "../services/StepHandler";
import {PurchaseFlowService} from "../services/PurchaseFlowService";
import {CommandHandler} from "../services/CommandHandler";
import {QueryHandler} from "../services/QueryHandler";
import {MessageRouter} from "../services/MessageRouter";
import TelegramBot from "node-telegram-bot-api";
import {DataProcessor} from "../services/DataProcessor";
import {config} from "../config/Config";
import {InputListener} from "../services/InputListener";
import {MessageHandler} from "../services/MessageHandler";

export class ServiceContainer {
    private readonly bot: TelegramBot;
    private readonly mongoService: MongoService;
    private readonly inputListener: InputListener;
    private readonly sender: MessageSender;
    private readonly state: StateManager;
    private readonly step: StepHandler;
    private readonly flow: PurchaseFlowService
    private readonly command: CommandHandler
    private readonly query: QueryHandler;
    private readonly router: MessageRouter;
    private readonly data: DataProcessor;
    private readonly msgHandler: MessageHandler;

    constructor(bot: Bot) {
        this.bot = bot.getTelegramBot();
        this.mongoService = new MongoService(config.mongo.uri, config.mongo.dbName);
        this.sender = new MessageSender(this.bot);
        this.data = new DataProcessor(this.mongoService);
        this.state = new StateManager();
        this.step = new StepHandler(this.sender);
        this.flow = new PurchaseFlowService(this.bot, this.sender, this.state);
        this.command = new CommandHandler(this.bot, this.flow, this.data);
        this.query = new QueryHandler(this.bot, this.data, this.state);
        this.msgHandler = new MessageHandler(this.state, this.step);
        this.router = new MessageRouter(this.command, this.msgHandler);
        this.inputListener = new InputListener(this.bot, this.router, this.query);
    }

    get mongo(): MongoService {
        return this.mongoService;
    }

    get listener(): InputListener {
        return this.inputListener;
    }
}