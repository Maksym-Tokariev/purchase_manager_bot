import {IStrategy} from "../interfaces/IStrategy";
import TelegramBot from "node-telegram-bot-api";
import {Keyboards} from "../../keyboards/Keyboards";
import {BaseStrategy} from "./BaseStrategy";
import {query} from "winston";
import {IInputSource} from "../../models/IInputSource";

export class AddCategoryStrategy extends BaseStrategy{
    constructor(bot: TelegramBot) {
        super(bot);
    }

    async handle(query: IInputSource): Promise<void> {
        await this.bot.sendMessage(query.message?.chat.id!,
            "You can add a category to the purchase, " +
            "and I'll group your purchases by category in further analysis. Enter category", {
            reply_markup: Keyboards.getAddCategoryKeyboard()
        });
    }


    canHandle(input: IInputSource): Optional<boolean> {
        return undefined;
    }
}