import {Logger} from "../../utils/Logger";
import {EventManager} from "../EventManager";

export class EventFactory {
    private readonly logger = new Logger(EventFactory.name);

    constructor(
        private events: EventManager
    ) {
    }

    async add(event: any): Promise<void> {
        await this.events.notify(event);
    }
}