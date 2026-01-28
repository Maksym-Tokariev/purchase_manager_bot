import TelegramBot, {BotCommand, Message} from "node-telegram-bot-api";
import {CommandService} from "./CommandService";
import {MessageSender} from "./MessageSender";

export class CommandHandler {
    private commandService: CommandService;
    private messageSender: MessageSender;
    private bot: TelegramBot;
    private commands: BotCommand[];

    constructor(messageSender: MessageSender, bot: TelegramBot) {
        this.bot = bot;
        this.commandService = new CommandService(bot)
        this.commandService.setCommandsList();
        this.commands = this.commandService.getCommands();
        this.messageSender = messageSender;
    }

    public async handle(message: Message): Promise<void> {
        console.log(`Command from ${message.from?.username} : ${message.text}`);
        const command: string = message.text!;

        switch (command) {
            case "/start":
                await this.handleStart(message);
                break;
            case "/help":
                await this.handleHelp(message);
                break;
            case "/ref":
                await this.handleRef(message);
                break;
            default:
                this.commandNotFound(message);
        }
    }

    private async handleStart(message: Message): Promise<void> {
        console.log("It's command start");
        if (message.text?.length! > 6) {
            const refID = message.text?.slice(7)!;

            await this.messageSender.send(message.chat.id, `You followed the link user with ID ${refID}`)
        }
    }

    private async handleHelp(message: Message): Promise<void> {
        console.log("It's command help");
    }

    private async handleRef(message: Message): Promise<void> {
        const link = `${process.env.URL_TO_BOT}?start=${message.from?.id}`
        await this.messageSender.send(message.chat.id, `${link}`)
    }

    private commandNotFound(message: Message): void {

    }
}