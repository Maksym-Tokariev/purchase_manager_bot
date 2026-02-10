import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";
import {ServiceContainer} from "./ServiceContainer";

export class InputListener {
    constructor(
        private serviceContainer: ServiceContainer
    ) {
        Logger.info("InputListener has been initialized", getContext(this));
    }

    public async listen(): Promise<void> {
        Logger.debug("Start listening", getContext(this));
        this.serviceContainer.bot.on('message', (msg) => this.serviceContainer.msgRouter.route(msg));
        this.serviceContainer.bot.on("callback_query", (query) => void this.serviceContainer.queryHandler.handle(query));
    }
}