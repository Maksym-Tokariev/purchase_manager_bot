import TelegramBot from "node-telegram-bot-api";
import {PurchaseStep} from "../models/PurchaseStep";
import {Logger} from "../utils/Logger";
import {Keyboards} from "../keyboards/Keyboards";
import {PurchaseState} from "../models/PurchaseState";

export class MessageSender {

    constructor(private readonly bot: TelegramBot) {
        this.bot = bot;
    }

    public async send(chatId: any, arg: any): Promise<void> {
        try {
            await this.bot.sendMessage(chatId, arg);
        } catch (err) {
            Logger.error(this, "Error send message: ", err);
        }
    }

    public async sendWithKeyboard(chatId: any, arg: any, keyboard: any): Promise<void> {
        try {
            await this.bot.sendMessage(chatId, arg, keyboard);
        } catch (err) {
            Logger.error(this, "Error send message: ", err);
        }
    }

    public async sendStepMessage(userId: number, chatId: number, step: PurchaseStep, input?: PurchaseState): Promise<void> {
        switch (step) {
            case PurchaseStep.NAME:
                await this.bot.sendMessage(chatId, "Let's create a purchaser! Enter the name of the purchase and then we will continue", {
                    reply_markup: {
                        inline_keyboard: Keyboards.getCancel()
                    }
                });
                break;
            case PurchaseStep.PRICE:
                await this.bot.sendMessage(chatId, "Good, next I need to know the purchase price", {
                    reply_markup: {
                        inline_keyboard: Keyboards.getCancel()
                    }
                });
                break;
            case PurchaseStep.DATE:
                await this.bot.sendMessage(chatId, "Great, now I need to know the date of purchase", {
                    reply_markup: {
                        keyboard: Keyboards.getDateKeyboard(),
                        resize_keyboard: true,
                        one_time_keyboard: true
                    },
                });
                break;
            case PurchaseStep.CONFIRM:
                await this.bot.sendMessage(chatId,
                    `Good, I got all of them, Check that they are correct:\n ${input?.data.name}\n ${input?.data.price}\n ${input?.data.date?.toLocaleDateString()}`,
                    {
                        reply_markup: {
                            inline_keyboard: Keyboards.getConfirmationInlineKeyboard(userId)
                        }
                    }
                )
                break;
        }
    }
}