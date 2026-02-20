import {PurchaseStep} from "../../models/PurchaseStep";
import {StateManager} from "../StateManager";
import {StepHandler} from "./StepHandler";
import {CommandHandler} from "./CommandHandler";
import {CallbackQuery, Message} from "node-telegram-bot-api";
import {PurchaseFlowService} from "../PurchaseFlowService";

export class MessageHandler {

    constructor(
        private state: StateManager,
        private step: StepHandler,
        private command: CommandHandler,
        private flow: PurchaseFlowService
    ) {
    }

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
                input.text = "/history";
                await this.command.handle(input);
                break;
        }
    }

    private normalizeInput(input: Message): InputContext {
        return {
            userId: input.from!.id,
            chatId: input.chat.id,
            text: input.text ?? ""
        }
    }


}