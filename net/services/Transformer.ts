import {IInputSource} from "../models/IInputSource";
import {MessageAdapter} from "../adapters/MessageAdapter";

export class Transformer {
    async transform(input: any): Promise<void> {
        if (input.text === undefined || input.chat !== undefined) {
        }
    }
}