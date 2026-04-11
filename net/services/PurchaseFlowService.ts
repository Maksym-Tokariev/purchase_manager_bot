import {StateManager} from "./StateManager";
import {PurchaseStep} from "../models/PurchaseStep";
import {MessageSender} from "./MessageSender";
import {StepHandler} from "./handlers/StepHandler";
import {ValidationService} from "./validation/ValidationService";
import {Logger} from "../utils/Logger";
import {IInputSource} from "../models/IInputSource";

export class PurchaseFlowService {
    private readonly logger = new Logger(PurchaseFlowService.name);

    constructor(
        private sender: MessageSender,
        private state: StateManager,
        private step: StepHandler,
        private validator: ValidationService
    ) {
    }

    async startAddFlow(userId: number, chatId: number): Promise<void> {
        this.state.startFlow(userId, chatId, PurchaseStep.NAME);
        await this.setTimeout(userId, chatId);
        await this.sender.sendStepMessage(userId, chatId, PurchaseStep.NAME);
    }

    async startEditFlow(userId: number, chatId: number): Promise<void> {
        this.state.startFlow(userId, chatId, PurchaseStep.EDIT_IN);
        await this.setTimeout(userId, chatId);
        await this.sender.sendStepMessage(userId, chatId, PurchaseStep.EDIT_IN);
    }

    public async handleFlow(userId: number, chatId: number, input: IInputSource): Promise<void> {
        this.logger.debug('Handle flow for user with id: ', userId);

        if (input.type === 'message' && input.text) {
            await this.handleMessageInputToFlow(userId, chatId, input.text);
        }

        if (input.type === 'callback' && input.data) {
            await this.handleCallbackInputToFlow(userId, chatId, input.data);
        }
    }

    private async handleMessageInputToFlow(userId: number, chatId: number, text: string) {
        const state = this.state.getCurrState(userId);

        if (!state) return;

        const validation = await this.validator.validate(text, state.currentStep);

        if (!validation.valid) {
            await this.sender.sendMessage(chatId, validation.error!);
            return;
        }
        await this.step.handle(userId, chatId, validation.value, state);
        return;
    }

    private async handleCallbackInputToFlow(userId: number, chatId: number, queryData: any) {

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