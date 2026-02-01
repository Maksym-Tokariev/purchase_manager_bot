import {config} from "./config/Config";
import TelegramBot from "node-telegram-bot-api";
import {MessageListener} from "./services/MessageListener";
import {MongoService} from "./services/MongoService";


export class Bot {
    private token: string = config.token;
    private readonly bot: TelegramBot;
    private readonly mongo: MongoService;

    public constructor() {
        this.bot = new TelegramBot(this.token, { polling: true });
        this.mongo = new MongoService("mongodb://localhost:27017", "PurchaseManager");
        this.mongo.connect().then(() =>
            console.log("Successful connection to the database")
        );

        this.initialize();
    }

    private initialize(): void {
        this.setupErrorHandling();
        this.setupMessageListener();
    }

    private setupErrorHandling(): void {
        this.bot.on("polling_error", (err: Error) => {
            console.log(`Polling error: [${err}]`)
        })
    }

    private setupMessageListener(): void {
        new MessageListener(this, this.mongo);
    }

    public async start(): Promise<void> {
        console.log('Bot started successfully!');
    }

    public async stop(): Promise<void> {
        if (this.bot.isPolling()) {
            await this.bot.stopPolling();
        }
        console.log("Bot stopped");
    }

    public getTelegramBot(): TelegramBot {
        return this.bot;
    }
}
