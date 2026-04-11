import {BaseStrategy} from "./BaseStrategy";
import TelegramBot from "node-telegram-bot-api";
import {IInputSource} from "../../models/IInputSource";
import {StateManager} from "../StateManager";
import {PurchaseStep} from "../../models/PurchaseStep";
import {MessageSender} from "../MessageSender";

export class StartEditNameStrategy extends BaseStrategy {
    constructor(
        bot: TelegramBot,
        private state: StateManager,
        private sender: MessageSender
    ) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        const userId = input.userId;
        const chatId = input.chatId;

        if (!userId || !chatId) return;

        const state = this.state.getCurrState(userId);

        this.state.updateStep(input.userId, PurchaseStep.EDIT_NAME);
        await this.sender.sendStepMessage(input.userId, input.chatId, PurchaseStep.EDIT_NAME, state);
        await this.answerQuery(input);
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.data) {
            return event.data === 'edit_name';
        }
        return false;
    }
}