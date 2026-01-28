import {Message} from "node-telegram-bot-api";
import {MessageSender} from "./MessageSender";

export class MessageHandler {

    constructor(messageSender: MessageSender) {

    }

    public async handle(message: Message): Promise<void> {
        console.log(`Message from ${message.from?.username} : ${message.text}`);
    }
}