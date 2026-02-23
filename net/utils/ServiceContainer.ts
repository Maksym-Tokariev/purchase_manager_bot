import {Bot} from "../Bot";
import {MongoService} from "../services/MongoService";
import {MessageSender} from "../services/MessageSender";
import {StateManager} from "../services/StateManager";
import {StepHandler} from "../services/handlers/StepHandler";
import {PurchaseFlowService} from "../services/PurchaseFlowService";
import {CommandHandler} from "../services/handlers/CommandHandler";
import {QueryHandler} from "../services/handlers/QueryHandler";
import {MessageRouter} from "../services/MessageRouter";
import TelegramBot from "node-telegram-bot-api";
import {DataProcessor} from "../services/DataProcessor";
import {config} from "../config/Config";
import {InputListener} from "../services/InputListener";
import {MessageHandler} from "../services/handlers/MessageHandler";
import {ValidationService} from "../services/validation/ValidationService";

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
    private readonly message: MessageHandler;
    private readonly validation: ValidationService;

    constructor(bot: Bot) {
        this.bot = bot.getTelegramBot();
        this.validation = new ValidationService();
        this.mongoService = new MongoService(config.mongo.uri, config.mongo.dbName);
        this.sender = new MessageSender(this.bot);
        this.data = new DataProcessor(this.mongoService);
        this.state = new StateManager();
        this.step = new StepHandler(this.sender);
        this.flow = new PurchaseFlowService(this.sender, this.state, this.step, this.validation);
        this.command = new CommandHandler(this.bot, this.flow, this.data, this.sender);
        this.message = new MessageHandler(this.command, this.flow, this.sender, this.data);
        this.query = new QueryHandler(this.bot, this.data, this.state, this.flow, this.sender);
        this.router = new MessageRouter(this.command, this.message, this.state, this.flow);
        this.inputListener = new InputListener(this.bot, this.router, this.query);
    }

    get mongo(): MongoService {
        return this.mongoService;
    }

    get listener(): InputListener {
        return this.inputListener;
    }
}