import TelegramBot, {CallbackQuery, Message} from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";
import {EventFactory} from "./event/EventFactory";

export class InputListener {
    private readonly logger = new Logger(InputListener.name);

    constructor(
        private readonly bot: TelegramBot,
        private eventFactory: EventFactory
    ) {
        this.logger.info("InputListener has been initialized");
    }

    public async listen(): Promise<void> {
        this.logger.debug("Start listening");
        this.bot.on('message',
            async (msg) => await this.addEvent(msg));
        this.bot.on('callback_query',
            async (query) => await this.addEvent(query));
    }

    async addEvent(input: Message | CallbackQuery): Promise<void> {
        await this.eventFactory.add(input);
    }
}