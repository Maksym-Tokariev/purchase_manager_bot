import {Message} from "node-telegram-bot-api";
import {CommandHandler} from "./handlers/CommandHandler";
import {MessageHandler} from "./handlers/MessageHandler";
import {StateManager} from "./StateManager";
import {PurchaseFlowService} from "./PurchaseFlowService";

export class MessageRouter {
    constructor(
        private commandHandler: CommandHandler,
        private message: MessageHandler,
        private state: StateManager,
        private flow: PurchaseFlowService
    ) {
    }

    public async route(msg: Message) {
        if (this.isCommand(msg)) {
            return await this.commandHandler.handle(msg);
        }
        if (this.isFlowMessage(msg)) {
            return await this.flow.handleFlow(msg.from?.id!, msg.chat.id, msg.text!);
        }
        return await this.message.handle(msg);
    }

    private isCommand(msg: Message): boolean {
        return !!msg.text && msg.text.startsWith("/");
    }

    private isFlowMessage(msg: Message): boolean {
        return !!msg.from && !!msg.text && this.state.isInFlow(msg.from.id);
    }


}