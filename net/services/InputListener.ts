import {Logger} from "../utils/Logger";
import TelegramBot from "node-telegram-bot-api";
import {MessageRouter} from "./MessageRouter";
import {QueryHandler} from "./QueryHandler";

export class InputListener {

    constructor(
        private readonly bot: TelegramBot,
        private readonly router: MessageRouter,
        private readonly query: QueryHandler,
    ) {
        Logger.info(this, "InputListener has been initialized");
    }

    public async listen(): Promise<void> {
        Logger.debug(this, "Start listening");
        this.bot.on('message',
            async (msg) => await this.router.route(msg));
        this.bot.on("callback_query",
            async (query) => await this.query.handle(query));
    }
}