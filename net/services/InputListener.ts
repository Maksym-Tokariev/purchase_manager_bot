import {Logger} from "../utils/Logger";
import {ServiceContainer} from "./ServiceContainer";

export class InputListener {
    constructor(
        private serviceContainer: ServiceContainer
    ) {
        Logger.info(this, "InputListener has been initialized");
    }

    public async listen(): Promise<void> {
        Logger.debug(this, "Start listening");
        this.serviceContainer.bot.on('message',
            (msg) => this.serviceContainer.msgRouter.route(msg));
        this.serviceContainer.bot.on("callback_query",
            (query) => void this.serviceContainer.queryHandler.handle(query));
    }
}