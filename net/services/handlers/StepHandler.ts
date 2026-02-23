import {PurchaseState} from "../../models/PurchaseState";
import {PurchaseStep} from "../../models/PurchaseStep";
import {MessageSender} from "../MessageSender";
import {ValidationDTO} from "../../models/ValidationDTO";
import {StateManager} from "../StateManager";

export class StepHandler {

    constructor(
        private sender: MessageSender,
        private state: StateManager
    ) {}

    async handle(userId: number, chatId: number, input: ValidationDTO["value"], state: PurchaseState): Promise<void> {
        if (!input) {
            await this.sender.sendMessage(chatId, "Incorrect value");
            return;
        }
        switch (state.currentStep) {
            case PurchaseStep.NAME:
                if (!input?.name) {
                    await this.sender.sendMessage(chatId, "Incorrect name");
                    return;
                }
                await this.handleName(userId, chatId, input.name, state);
                break;

            case PurchaseStep.PRICE:
                if (!input?.price) {
                    await this.sender.sendMessage(chatId, "Incorrect price");
                    return;
                }
                await this.handlePrice(userId, chatId, input.price, state);
                break;

            case PurchaseStep.DATE:
                if (!input?.date) {
                    await this.sender.sendMessage(chatId, "Incorrect date");
                    return;
                }
                await this.handleDate(userId, chatId, input.date, state);
                break;

            default:
                await this.setIdle(userId, state);
        }
    }

    async handleName(userId: number, chatId: number, name: string, state: PurchaseState): Promise<void> {
        if (!chatId || !name) return;

        this.state.updateData(userId, {name: name});
        this.state.updateStep(userId, PurchaseStep.PRICE);

        await this.sender.sendStepMessage(userId, chatId, state.currentStep);
    }

    async handlePrice(userId: number, chatId: number, price: number, state: PurchaseState): Promise<void> {
        if (!chatId || !price) return;

        this.state.updateData(userId, {price: price});
        this.state.updateStep(userId, PurchaseStep.DATE);

        await this.sender.sendStepMessage(userId, chatId, state.currentStep);
    }

    async handleDate(userId: number, chatId: number, date: Date, state: PurchaseState): Promise<void> {
        if (!chatId || !date) return;

        this.state.updateData(userId, {date: date});
        this.state.updateStep(userId, PurchaseStep.CONFIRM);

        await this.sender.sendStepMessage(userId, chatId, state.currentStep, state);
    }

    async setIdle(userId: number, state: PurchaseState): Promise<void> {
        if (state.currentStep !== PurchaseStep.IDLE) {
            state.currentStep = PurchaseStep.IDLE;
        }
    }
}