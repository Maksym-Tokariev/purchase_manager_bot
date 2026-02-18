import {Message} from "node-telegram-bot-api";
import {MessageSender} from "./MessageSender";
import {Logger} from "../utils/Logger";

export class MessageHandler {

    constructor(messageSender: MessageSender) {

    }

    public async handle(message: Message): Promise<void> {
      Logger.debug(this, `Message from ${message.from?.username} : ${message.text}`);
    }
}