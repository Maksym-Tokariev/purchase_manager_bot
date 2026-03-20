import TelegramBot from "node-telegram-bot-api";
import {MessageRouter} from "./MessageRouter";
import {QueryHandler} from "./handlers/QueryHandler";
import {Logger} from "../utils/Logger";

export class InputListener {
    private readonly logger = new Logger(InputListener.name);

    constructor(
        private readonly bot: TelegramBot,
        private readonly router: MessageRouter,
        private readonly query: QueryHandler,
    ) {
        this.logger.info("InputListener has been initialized");
    }

    public async listen(): Promise<void> {
        this.logger.debug("Start listening");
        this.bot.on('message',
            async (msg) => await this.router.route(msg));
        this.bot.on("callback_query",
            async (query) => await this.query.handle(query));
    }
}