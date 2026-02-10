import {Message} from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";
import {CommandHandler} from "./CommandHandler";
import {PurchaseFlowService} from "./PurchaseFlowService";

export class MessageRouter {
    constructor(private commandHandler: CommandHandler, private purchaseFlowService: PurchaseFlowService) {

    }

    public async route(msg: Message) {
        if (msg.text && msg.text.startsWith("/")) {
            try {
                void this.commandHandler.handle(msg);
            } catch (err) {
                Logger.error("An error occurred while handling the command:", getContext(this), msg);
            }
        } else if (msg.from?.id && msg.text) {
            try {
                void this.purchaseFlowService.handleUserMessage(msg.from?.id, msg.text);
            } catch (err) {
                Logger.error("An error occurred while handling the message:", getContext(this), msg);
            }
        }
    }
}