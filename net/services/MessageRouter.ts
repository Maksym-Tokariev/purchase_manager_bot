import {Message} from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";
import {CommandHandler} from "./CommandHandler";
import {PurchaseFlowService} from "./PurchaseFlowService";

export class MessageRouter {
    constructor(private commandHandler: CommandHandler, private purchaseFlowService: PurchaseFlowService) {}

    public async route(msg: Message) {
        if (msg.text && msg.text.startsWith("/")) {
            try {
                void this.commandHandler.handle(msg);
            } catch (err) {
                Logger.error(this, "An error occurred while handling the command:", msg);
            }
        } else if (msg.from?.id && msg.text) {
            try {
                void this.purchaseFlowService.handleUserMessage(msg.from?.id, msg.chat.id, msg.text);
            } catch (err) {
                Logger.error(this, "An error occurred while handling the message:", msg);
            }
        }
    }
}