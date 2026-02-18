import {config} from "./config/Config";
import TelegramBot from "node-telegram-bot-api";
import {Logger} from "./utils/Logger";
import {ServiceContainer} from "./utils/ServiceContainer";


export class Bot {
    private readonly bot: TelegramBot;
    private readonly container: ServiceContainer;

    public constructor() {
        this.bot = new TelegramBot(config.token, { polling: true });
        this.container = new ServiceContainer(this);

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
        this.container.listener.listen();
    }

    public async start(): Promise<void> {
        Logger.info(this, 'Bot started successfully!');
        await this.container.mongo.connect();
    }

    public async stop(): Promise<void> {
        if (this.bot.isPolling()) {
            await this.bot.stopPolling();
        }
        Logger.info(this, "Bot stopped");
        await this.container.mongo.disconnect();
    }

    public getTelegramBot(): TelegramBot {
        return this.bot;
    }
}
