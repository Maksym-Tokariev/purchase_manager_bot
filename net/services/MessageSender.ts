import TelegramBot from "node-telegram-bot-api";
import {PurchaseStep} from "../models/PurchaseStep";
import {Keyboards} from "../keyboards/Keyboards";
import {PurchaseState} from "../models/PurchaseState";
import {PurchaseDTO} from "../models/PurchaseDTO";
import {SendMessageError} from "../errors/SendMessageError";
import {Logger} from "../utils/Logger";

export class MessageSender {
    private readonly logger = new Logger(MessageSender.name);

    constructor(private readonly bot: TelegramBot) {}

    public async sendMessage(chatId: any, text: string): Promise<void> {
        try {
            await this.bot.sendMessage(chatId, text);
        } catch (err: unknown) {
            if (err instanceof SendMessageError) {
                this.logger.error(err.message, err.stack);
            }
        }
    }

    async sendStepMessage(
        userId: number,
        chatId: number,
        step: PurchaseStep,
        input?: PurchaseState,
    ): Promise<void> {
        try {
            switch (step) {
                case PurchaseStep.NAME:
                    await this.bot.sendMessage(chatId, "Let's create a purchaser! Enter the name of the purchase and then we will continue", {
                        reply_markup: Keyboards.getCancelKeyboard()
                    });
                    break;

                case PurchaseStep.PRICE:
                    await this.bot.sendMessage(chatId, "Good, next I need to know the purchase price", {
                        reply_markup: Keyboards.getCancelKeyboard()
                    });
                    break;

                case PurchaseStep.DATE:
                    await this.bot.sendMessage(chatId, "Great, now I need to know the date of purchase", {
                        reply_markup: Keyboards.getDateKeyboard()
                    });
                    break;

                case PurchaseStep.CONFIRM:
                    await this.bot.sendMessage(chatId,
                        `Good, I got all of them, Check that they are correct:\n ${input?.data.name}\n ${input?.data.price}\n ${input?.data.date?.toLocaleDateString()}`, {
                            reply_markup: Keyboards.getConfirmationInlineKeyboard(userId)
                        }
                    )
                    break;
                case PurchaseStep.EDIT:
                    await this.bot.sendMessage(chatId,
                        "Choose the parameter you want to change", {
                        reply_markup: Keyboards.getEditParameter()
                    });
            }
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
        }
    }

    async sendHistory(chatId: number, data: PurchaseDTO[]): Promise<void> {
        if (data.length > 0) {
            try {
                await this.bot.sendMessage(chatId, "✏️ History of the last 10 purchases");
                for (const purchase of data) {
                    await this.bot.sendMessage(chatId, purchase.value, {
                        reply_markup: Keyboards.getPurchaseOptionKeyboard(purchase.id)
                    });
                }
            } catch (err: any) {
                this.logger.error(err.message, err.stack);
            }
        } else
            await this.bot.sendMessage(chatId, "Your shopping list is empty.\nAdd purchases and try again");
    }
}