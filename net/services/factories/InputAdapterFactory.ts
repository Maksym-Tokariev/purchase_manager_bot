import {CallbackQuery, Message} from "node-telegram-bot-api";
import {IInputSource} from "../../models/IInputSource";
import {MessageAdapter} from "../../adapters/MessageAdapter";
import {CallbackAdapter} from "../../adapters/CallbackAdapter";

export class InputAdapterFactory {
    static create(input: Message | CallbackQuery): IInputSource {
        if (this.isMessage(input)) {
            return new MessageAdapter(input);
        }
        return new CallbackAdapter(input);
    }

    private static isMessage(input: any): input is Message {
        return input.text !== undefined || input.chat !== undefined;
    }
}