import {Bot} from "../Bot";
import {MongoService} from "../services/MongoService";
import {MessageSender} from "../services/MessageSender";
import {StateManager} from "../services/StateManager";
import {StepHandler} from "../services/handlers/StepHandler";
import {PurchaseFlowService} from "../services/PurchaseFlowService";
import TelegramBot from "node-telegram-bot-api";
import {DataProcessor} from "../services/DataProcessor";
import {config} from "../config/Config";
import {InputListener} from "../services/InputListener";
import {ValidationService} from "../services/validation/ValidationService";
import {EventFactory} from "../services/event/EventFactory";
import {EventManager} from "../services/event/EventManager";
import {StrategyFactory} from "../services/strategies/StrategyFactory";
import {StrategyRegistry} from "../services/strategies/StrategyRegistry";

export class ServiceContainer {
    private readonly bot: TelegramBot;
    private readonly mongoService: MongoService;
    private readonly inputListener: InputListener;
    private readonly sender: MessageSender;
    private readonly state: StateManager;
    private readonly step: StepHandler;
    private readonly flow: PurchaseFlowService
    private readonly data: DataProcessor;
    private readonly validation: ValidationService;
    private readonly eventFactory: EventFactory;
    private readonly eventManager: EventManager;

    constructor(bot: Bot) {
        this.bot = bot.getTelegramBot();
        this.validation = new ValidationService();
        this.mongoService = new MongoService(config.mongo.uri!, config.mongo.dbName!);
        this.sender = new MessageSender(this.bot);
        this.data = new DataProcessor(this.mongoService);
        this.state = new StateManager();
        this.eventManager = new EventManager();
        this.eventFactory = new EventFactory(this.eventManager);
        this.step = new StepHandler(this.sender, this.state);
        this.flow = new PurchaseFlowService(this.sender, this.state, this.step, this.validation);
        this.inputListener = new InputListener(this.bot, this.eventFactory);


        const statFactory = new StrategyFactory(this.state, this.flow, this.eventManager, this.register().strategies);
        statFactory.subscribe();
    }

    private register() {
        return new StrategyRegistry(this.bot, this.data, this.state, this.flow, this.sender);
    }

    get mongo(): MongoService {
        return this.mongoService;
    }

    get listener(): InputListener {
        return this.inputListener;
    }
}