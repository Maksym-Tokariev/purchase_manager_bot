import {StateManager} from "./StateManager";
import {PurchaseStep} from "../models/PurchaseStep";
import {MessageSender} from "./MessageSender";
import {StepHandler} from "./handlers/StepHandler";
import {ValidationService} from "./validation/ValidationService";
import {Purchase} from "../models/Purchase";

export class PurchaseFlowService {
    constructor(
        private sender: MessageSender,
        private state: StateManager,
        private step: StepHandler,
        private validator: ValidationService
    ) {}

    async startAddFlow(userId: number, chatId: number): Promise<void> {
        this.state.startFlow(userId, chatId, PurchaseStep.NAME);
        await this.setTimeout(userId, chatId);
        await this.sender.sendStepMessage(userId, chatId, PurchaseStep.NAME);
    }

    async startEditFlow(userId: number, chatId: number): Promise<void> {
        this.state.startFlow(userId, chatId, PurchaseStep.EDIT);
        await this.setTimeout(userId, chatId);
        await this.sender.sendStepMessage(userId, chatId, PurchaseStep.EDIT);
    }

    public async handleFlow(userId: number, chatId: number, text: string): Promise<void> {
        const state = this.state.getCurrState(userId);

        if (!state) return;

        const validation = await this.validator.validate(text, state.currentStep);

        if (!validation.valid) {
            await this.sender.sendMessage(chatId, validation.error!);
            return;
        }
        await this.step.handle(userId, chatId, validation["value"], state);
    }

    private async setTimeout(userId: number, chatId: number): Promise<void> {
        setTimeout(() => {
            if (this.state.isInFlow(userId)) {
                this.state.cancelFlow(userId, chatId);
                this.sender.sendMessage(chatId, "Session time out. Start over");
            }
        }, 5 * 60 * 1000);
    }
}