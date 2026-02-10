import TelegramBot from "node-telegram-bot-api";
import {PurchaseStep} from "../models/PurchaseStep";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";
import {Keyboards} from "../keyboards/Keyboards";

export class MessageSender {

    constructor(private readonly bot: TelegramBot) {
        this.bot = bot;
    }

    public async send(chatId: any, arg: any): Promise<void> {
        try {
            await this.bot.sendMessage(chatId, arg);
        } catch (err) {
            Logger.error("Error send message: ", getContext(this), err);
        }
    }

    public async sendStepMessage(userId: number, chatId: number, step: PurchaseStep): Promise<void> {
        switch (step) {
            case PurchaseStep.NAME:
                await this.bot.sendMessage(chatId, "Let's create a purchaser! Enter the name of the purchase and then we will continue.");
                break;
            case PurchaseStep.PRICE:
            case PurchaseStep.DATE:
            case PurchaseStep.CONFIRM:
        }
    }
}