import {PurchaseState} from "../models/PurchaseState";
import {PurchaseStep} from "../models/PurchaseStep";
import {MessageSender} from "./MessageSender";
import {parseInteger} from "mongodb/src/utils";
import {PurchaseValidator} from "./PurchaseValidator";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";

export class StepHandler {

    constructor(private msgSender: MessageSender) {}

    async handleName(userId: number, chatId: number, text: string, state: PurchaseState): Promise<void> {
        if (!chatId || !text) return;

        const name = PurchaseValidator.validateName(text);

        if (name.valid) {
            state.data.name = text;
            state.currentStep = PurchaseStep.PRICE;

            await this.msgSender.sendStepMessage(userId, chatId, state.currentStep);
        } else {
            await this.msgSender.send(chatId, `Invalid name: [${name.error}]`);
        }
    }

    async handlePrice(userId: number, chatId: number, text: string, state: PurchaseState): Promise<void> {
        if (!chatId || !text) return;

        const price = PurchaseValidator.validatePrice(text);

        if (price.valid) {
            state.data.price = price.value!;
            state.currentStep = PurchaseStep.DATE;

            await this.msgSender.sendStepMessage(userId, chatId, state.currentStep);
        } else {
            await this.msgSender.send(chatId, `Invalid price: [${price.error}]`);
        }
    }

    async handleDate(userId: number, chatId: number, text: string, state: PurchaseState): Promise<void> {
        if (!chatId || !text) return;

        const date = PurchaseValidator.validateDate(text);

        if (date.error) {
            Logger.error("Date validation error:", getContext(this), date.error);
            await this.msgSender.send(chatId, "Invalid date, please try enter date again");
        }

        if (date.valid) {
            state.data.date = date.value;
            state.currentStep = PurchaseStep.CONFIRM;

            await this.msgSender.sendStepMessage(userId, chatId, state.currentStep, state);
        } else {
            await this.msgSender.send(chatId, `Invalid date [${date.error}]`);
        }
    }

    async handleConfirm(userId: number, chatId: number, text: string, state: PurchaseState): Promise<void> {

    }

    async setIdle(userId: number, state: PurchaseState): Promise<void> {
        if (state.currentStep !== PurchaseStep.IDLE) {
            state.currentStep = PurchaseStep.IDLE;
        }
    }
}