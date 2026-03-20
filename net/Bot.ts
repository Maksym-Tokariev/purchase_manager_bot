import {config} from "./config/Config";
import TelegramBot from "node-telegram-bot-api";
import {ServiceContainer} from "./utils/ServiceContainer";
import {Logger} from "./utils/Logger";


export class Bot {
    private readonly bot: TelegramBot;
    private readonly container: ServiceContainer;
    private readonly logger = new Logger(Bot.name);

    public constructor() {
        this.bot = new TelegramBot(config.token, { polling: true });
        this.container = new ServiceContainer(this);

        this.initialize();
    }

    private initialize(): void {
        this.logger.debug("Start initializing");
        try {
            this.setupErrorHandling();
            this.setupMessageListener();
            this.logger.debug("Successful initialization")
        } catch (err) {
            this.logger.error("Initializing error: ");
            this.stop();
        }
    }

    private setupErrorHandling(): void {
        this.bot.on("polling_error", (err: Error) => {
            this.logger.error(`Polling error: [${err}]`);
        })
    }

    private setupMessageListener(): void {
        this.container.listener.listen();
    }

    public async start(): Promise<void> {
        this.logger.info('Bot started successfully!');
        await this.container.mongo.connect();
    }

    public async stop(): Promise<void> {
        if (this.bot.isPolling()) {
            await this.bot.stopPolling();
        }
        this.logger.info("Bot stopped");
        await this.container.mongo.disconnect();
    }

    public getTelegramBot(): TelegramBot {
        return this.bot;
    }
}
