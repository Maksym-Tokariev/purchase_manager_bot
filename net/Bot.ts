import {config} from "./config/Config";
import TelegramBot from "node-telegram-bot-api";
import {InputListener} from "./services/InputListener";
import {MongoService} from "./services/MongoService";
import {Logger} from "./utils/Logger";
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
            Logger.info(this, "Successful connection to the database")
        );

        this.initialize();
    }

    private initialize(): void {
        Logger.debug(this, "Start initializing");
        try {
            this.setupErrorHandling();
            this.setupMessageListener();
            Logger.debug(this, "Successful initialization")
        } catch (err) {
            Logger.error(this, "Initializing error: ");
            this.stop();
        }
    }

    private setupErrorHandling(): void {
        this.bot.on("polling_error", (err: Error) => {
            Logger.error(this, `Polling error: [${err}]`);
        })
    }

    private setupMessageListener(): void {
        const listener = new InputListener(this.serviceContainer);
        listener.listen();
    }

    public async start(): Promise<void> {
        Logger.info(this, 'Bot started successfully!');
    }

    public async stop(): Promise<void> {
        if (this.bot.isPolling()) {
            await this.bot.stopPolling();
        }
        Logger.info(this, "Bot stopped");
    }

    public getTelegramBot(): TelegramBot {
        return this.bot;
    }
}
