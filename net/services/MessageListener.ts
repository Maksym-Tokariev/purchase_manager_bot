import TelegramBot, {Message} from "node-telegram-bot-api";
import {Bot} from "../Bot";
import {CommandHandler} from "./CommandHandler";
import {MessageHandler} from "./MessageHandler";

export class MessageListener {
    private bot: TelegramBot
    private commandHandler: CommandHandler = new CommandHandler();
    private messageHandler: MessageHandler = new MessageHandler();

    constructor(bot: Bot) {
        this.bot = bot.getTelegramBot();
        this.listen();
    }

    private async listen(): Promise<void> {
        this.bot.on('message', async (msg: Message) => {
            if (msg.text && msg.text.startsWith("/")) {
                await this.commandHandler.handle(msg);
            } else {
                await this.messageHandler.handle(msg);
            }
        });
    }
}