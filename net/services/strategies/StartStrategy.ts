import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";
import TelegramBot from "node-telegram-bot-api";

export class StartStrategy extends BaseStrategy {
    constructor(bot: TelegramBot) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        if (input.text?.length! > 6) {
            const refID = input.text?.slice(7)!;


            await this.bot.sendMessage(input.chatId, `You followed the link user with ID ${refID}`)
        }

        const name: string = input.from?.first_name ? input.from?.first_name! : input.from?.username!

        await this.bot.sendMessage(input.chatId,
            `Hello, ${name}. \nWith my help you can track your spending.\nSend me what you bought ande when, and I'll compile statistics for you`, {
                reply_markup: {
                    keyboard: [
                        [{text: "Add"}],
                        [{text: "Help"}],
                        [{text: "History"}]
                    ]
                }
            });
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.type === 'message')
            return event.text === '/start';
        return false;
    }
}