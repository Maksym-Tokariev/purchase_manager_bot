import {config} from "./config/Config";
import TelegramBot from "node-telegram-bot-api";
import {MessageListener} from "./services/MessageListener";
import {MongoService} from "./services/MongoService";
import {Logger} from "./utils/Logger";
import {getContext} from "./utils/Context";


export class Bot {
    private token: string = config.token;
    private readonly bot: TelegramBot;
    private readonly mongo: MongoService;

    public constructor() {
        this.bot = new TelegramBot(this.token, { polling: true });
        this.mongo = new MongoService(config.mongo.uri, config.mongo.dbName);
        this.mongo.connect().then(() =>
            Logger.info("Successful connection to the database", getContext(this))
        );

        this.initialize();
    }

    private initialize(): void {
        this.setupErrorHandling();
        this.setupMessageListener();
    }

    private setupErrorHandling(): void {
        this.bot.on("polling_error", (err: Error) => {
            Logger.error(`Polling error: [${err}]`, getContext(this));
        })
    }

    private setupMessageListener(): void {
        new MessageListener(this, this.mongo);
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
