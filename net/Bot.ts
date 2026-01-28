import {config} from "./config/Config";
import TelegramBot from "node-telegram-bot-api";
import {Message} from "node-telegram-bot-api";
import {CommandService} from "./services/CommandService";
import {MessageListener} from "./services/MessageListener";


export class Bot {
    private token: string = config.token;
    private readonly bot: TelegramBot;

    public constructor() {
        this.bot = new TelegramBot(this.token, { polling: true });

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
        new MessageListener(this);
    }

    public async start(): Promise<void> {
        new CommandService();
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
