import {config} from "./config/Config";
import TelegramBot from "node-telegram-bot-api";
import {Message} from "node-telegram-bot-api";
import {CommandService} from "./services/CommandService";


export class Bot {
    private token: string = config.token;
    private bot: TelegramBot;

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
        this.bot.on('message', (msg: Message) => {
            if (msg.text && msg.text.startsWith("/")) {
                this.handleCommand(msg);
            } else {
                this.handleMessage(msg);
            }
        })
    }

    private async handleCommand(msg: Message): Promise<void> {
        console.log(`Command from ${msg.from?.username} : ${msg.text}`);
    }

    private async handleMessage(msg: Message): Promise<void> {
        if (msg.text) {
            console.log(`Message from ${msg.from?.username} : ${msg.text}`);
        }
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
}
