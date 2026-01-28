import {Message} from "node-telegram-bot-api";

export class MessageHandler {
    public async handle(message: Message): Promise<void> {
        console.log(`Message from ${message.from?.username} : ${message.text}`);
    }
}