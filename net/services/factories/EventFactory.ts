import {Logger} from "../../utils/Logger";
import {EventManager} from "../EventManager";
import {CallbackQuery, Message} from "node-telegram-bot-api";
import {MessageAdapter} from "../../adapters/MessageAdapter";
import {CallbackAdapter} from "../../adapters/CallbackAdapter";
import {IInputSource} from "../../models/IInputSource";

export class EventFactory {
    private readonly logger = new Logger(EventFactory.name);

    constructor(
        private events: EventManager
    ) {}

    async add(input: Message | CallbackQuery): Promise<void> {
        this.logger.debug('Add an event')
        const event: Optional<IInputSource> = await this.define(input);
        if (!event) {
            this.logger.warn('Empty event');
            return;
        }
        await this.events.notify(event);
    }

    async define(event: Message | CallbackQuery): Promise<Optional<IInputSource>> {
        if ('text' in event)
            return new MessageAdapter(event);
        if ('data' in event)
            return new CallbackAdapter(event);
        return undefined;
    }
}