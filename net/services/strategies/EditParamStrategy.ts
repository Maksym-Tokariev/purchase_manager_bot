import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../../models/IInputSource";
import TelegramBot from "node-telegram-bot-api";

export class EditParamStrategy extends BaseStrategy {
    constructor(
        bot: TelegramBot,
    ) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        return Promise.resolve(undefined);
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.type === 'message') {
            return;
        }
        return (event.data === 'edit_name' || event.data === 'edit_price' || event.data === 'edit_date');

    }
}