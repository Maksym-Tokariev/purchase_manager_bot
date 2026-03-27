import TelegramBot from "node-telegram-bot-api";
import {Keyboards} from "../../keyboards/Keyboards";
import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";
import {Logger} from "../../utils/Logger";

export class AddCategoryStrategy extends BaseStrategy{
    private logger = new Logger(AddCategoryStrategy.name);

    constructor(bot: TelegramBot) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        await this.bot.sendMessage(input.message?.chat.id!,
            "You can add a category to the purchase, " +
            "and I'll group your purchases by category in further analysis. Enter category", {
            reply_markup: Keyboards.getAddCategoryKeyboard()
        });
    }


    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        return false;
    }
}