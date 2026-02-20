import {CommandHandler} from "./CommandHandler";
import {Message} from "node-telegram-bot-api";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {MessageSender} from "../MessageSender";
import {PurchaseDTO} from "../../models/PurchaseDTO";
import {DataProcessor} from "../DataProcessor";
import {config} from "../../config/Config";
import {InputContext} from "../../models/InputContext";

export class MessageHandler {

    constructor(
        private command: CommandHandler,
        private flow: PurchaseFlowService,
        private sender: MessageSender,
        private data: DataProcessor
    ) {}

    async handle(input: Message): Promise<void> {
        const {userId, chatId, text} = this.normalizeInput(input);

        switch (text) {
            case "Add":
                await this.flow.startPurchaseFlow(userId, chatId);
                break;
            case "Help":
                input.text = "/help";
                await this.command.handle(input);
                break;
            case "History":
                await this.handleHistory(userId, chatId);
                break;
        }
    }

    private async handleHistory(userId: number, chatId: number): Promise<void> {
        const data: PurchaseDTO[] = await this.data.getLastPurchases(userId, config.history_limit);
        await this.sender.sendHistory(chatId, data);
    }

    private normalizeInput(input: Message): InputContext {
        return {
            userId: input.from!.id,
            chatId: input.chat.id,
            text: input.text ?? ""
        }
    }


}