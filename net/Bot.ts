import {config} from "./config/Config";
import TelegramBot from "node-telegram-bot-api";
import {InputListener} from "./services/InputListener";
import {MongoService} from "./services/MongoService";
import {Logger} from "./utils/Logger";
import {getContext} from "./utils/Context";
import {ServiceContainer} from "./services/ServiceContainer";


export class Bot {
    private token: string = config.token;
    private readonly bot: TelegramBot;
    private readonly mongo: MongoService;
    private readonly serviceContainer: ServiceContainer;

    public constructor() {
        this.bot = new TelegramBot(this.token, { polling: true });
        this.mongo = new MongoService(config.mongo.uri, config.mongo.dbName);
        this.serviceContainer = new ServiceContainer(this, this.mongo);
        this.mongo.connect().then(() =>
            Logger.info("Successful connection to the database", getContext(this))
        );

        this.initialize();
    }

    private initialize(): void {
        Logger.debug("Start initializing", getContext(this));
        try {
            this.setupErrorHandling();
            this.setupMessageListener();
            Logger.debug("Successful initialization", getContext(this))
        } catch (err) {
            Logger.error("Initializing error: ", getContext(this), err);
            this.stop();
        }
    }

    private setupErrorHandling(): void {
        this.bot.on("polling_error", (err: Error) => {
            Logger.error(`Polling error: [${err}]`, getContext(this));
        })
    }

    private setupMessageListener(): void {
        const listener = new InputListener(this.serviceContainer);
        listener.listen();
    }

    public async start(): Promise<void> {
        Logger.info('Bot started successfully!', getContext(this));
    }

    public async stop(): Promise<void> {
        if (this.bot.isPolling()) {
            await this.bot.stopPolling();
        }
        Logger.info("Bot stopped", getContext(this));
    }

    public getTelegramBot(): TelegramBot {
        return this.bot;
    }
}
