import {Bot} from "../Bot";
import {MongoService} from "./MongoService";
import {MessageSender} from "./MessageSender";
import {StateManager} from "./StateManager";
import {StepHandler} from "./StepHandler";
import {PurchaseFlowService} from "./PurchaseFlowService";
import {CommandHandler} from "./CommandHandler";
import {QueryHandler} from "./QueryHandler";
import {MessageRouter} from "./MessageRouter";
import TelegramBot from "node-telegram-bot-api";

export class ServiceContainer {
    private readonly _bot: TelegramBot;
    private readonly _messageSender: MessageSender;
    private readonly _stateManager: StateManager;
    private readonly _stepHandler: StepHandler;
    private readonly _purchaseFlowService: PurchaseFlowService
    private readonly _commandHandler: CommandHandler
    private readonly _queryHandler: QueryHandler;
    private readonly _msgRouter: MessageRouter;

    constructor(bot: Bot, private _mongo: MongoService) {
        this._bot = bot.getTelegramBot();
        this._messageSender = new MessageSender(this._bot);
        this._stateManager = new StateManager();
        this._stepHandler = new StepHandler(this._messageSender);
        this._purchaseFlowService = new PurchaseFlowService(this._bot, this._messageSender, this._stateManager, this._stepHandler);
        this._commandHandler = new CommandHandler(this._messageSender, this._bot, this._purchaseFlowService, this._mongo);
        this._queryHandler = new QueryHandler(this._bot);
        this._msgRouter = new MessageRouter(this._commandHandler, this._purchaseFlowService);
    }


    get bot(): TelegramBot {
        return this._bot;
    }

    get messageSender(): MessageSender {
        return this._messageSender;
    }

    get stateManager(): StateManager {
        return this._stateManager;
    }

    get stepHandler(): StepHandler {
        return this._stepHandler;
    }

    get purchaseFlowService(): PurchaseFlowService {
        return this._purchaseFlowService;
    }

    get commandHandler(): CommandHandler {
        return this._commandHandler;
    }

    get queryHandler(): QueryHandler {
        return this._queryHandler;
    }

    get msgRouter(): MessageRouter {
        return this._msgRouter;
    }

    get mongo(): MongoService {
        return this._mongo;
    }
}