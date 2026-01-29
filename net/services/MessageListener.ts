import TelegramBot, {Message} from "node-telegram-bot-api";
import {Bot} from "../Bot";
import {CommandHandler} from "./CommandHandler";
import {MessageHandler} from "./MessageHandler";
import {MessageSender} from "./MessageSender";

export class MessageListener {
    private bot: TelegramBot
    private commandHandler: CommandHandler;
    private messageHandler: MessageHandler;
    private readonly messageSender: MessageSender;

    constructor(bot: Bot) {
        this.bot = bot.getTelegramBot();
        this.messageSender = new MessageSender(bot.getTelegramBot());
        this.commandHandler = new CommandHandler(this.messageSender, bot.getTelegramBot());
        this.messageHandler = new MessageHandler(this.messageSender);
        this.listen();
        console.log("MessageListener has been initialized");
    }

    private async listen(): Promise<void> {
        try {
            this.bot.on('message', async (msg: Message): Promise<void> => {
                if (msg.text && msg.text.startsWith("/")) {
                    await this.commandHandler.handle(msg);
                } else {
                    await this.messageHandler.handle(msg);
                }
            });
        } catch (err) {
            console.log("Message error: ", err)
        }
    }
}