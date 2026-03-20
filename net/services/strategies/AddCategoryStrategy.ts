import {IStrategy} from "../interfaces/IStrategy";
import TelegramBot from "node-telegram-bot-api";
import {Keyboards} from "../../keyboards/Keyboards";

export class AddCategoryStrategy implements IStrategy {
    constructor(private bot: TelegramBot) {}

    async handle(query: TelegramBot.CallbackQuery): Promise<void> {
        await this.bot.sendMessage(query.message?.chat.id!,
            "You can add a category to the purchase, " +
            "and I'll group your purchases by category in further analysis. Enter category", {
            reply_markup: Keyboards.getAddCategoryKeyboard()
        });
    }
}