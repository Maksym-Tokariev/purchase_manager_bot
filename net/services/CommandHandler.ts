import TelegramBot, {BotCommand, Message} from "node-telegram-bot-api";
import {CommandService} from "./CommandService";
import {MessageSender} from "./MessageSender";
import {Purchase} from "../Components/Purchase";
import {Parser} from "./Parser";
import DataCollector from "./DataCollector";

export class CommandHandler {
    private commandService: CommandService;
    private readonly messageSender: MessageSender;
    private bot: TelegramBot;
    private commands: BotCommand[];

     constructor(messageSender: MessageSender, bot: TelegramBot) {
        this.bot = bot;
        this.commandService = new CommandService(bot);
        this.commandService.setCommandsList()
            .then(() => console.log("Commands have been set"));
        this.commands = this.commandService.getCommands();
        this.messageSender = messageSender;
    }

    public async handle(message: Message): Promise<void> {
        console.log(`Command from ${message.from?.username} : ${message.text}`);
        const command: string = message.text!;

        if (command.startsWith("/start"))
            await this.handleStart(message);
        else if (command === "/help")
            await this.handleHelp(message);
        else if (command === "/ref")
            await this.handleRef(message);
        else if (command === "/options")
            await this.HandleOptions(message);
        else if (command === "/purchase")
            await this.handlePurchase(message);
        else if (command === "/command_list")
            await this.handleCommandList(message);
        else if (command === "/getStat")
            await this.handleStart(message);
        else
            await this.commandNotFound(message);
    }

    private async handleStart(message: Message): Promise<void> {
        if (message.text?.length! > 6) {
            const refID = message.text?.slice(7)!;

            await this.messageSender.send(message.chat.id, `You followed the link user with ID ${refID}`)
        }

        const name: string = message.from?.first_name ? message.from?.first_name! : message.from?.username!

        await this.messageSender.send(message.chat.id,
            `Hello, ${name}. \nWith my help you can track your spending.\nSend me what you bought ande when, and I'll compile statistics for you`);
    }

    private async handleHelp(message: Message): Promise<void> {
        await this.messageSender.send(message.chat.id,
            "Send purchase detail using this template: \n/purchase [product name, price, time(optional)]\n"
            + "You can also send me list? for example: \nproduct one, price one; \nproduct two, price; \n...\n"
            + "You may omit the purchase time; in this case, I will save the dispatch time as the purchase time.\n"
        );
    }

    private async handleRef(message: Message): Promise<void> {
        const link = `${process.env.URL_TO_BOT}?start=ref_${message.from?.id}`
        await this.messageSender.send(message.chat.id, `Your referral link: ${link}`);
    }

    private async commandNotFound(message: Message): Promise<void> {
         await this.messageSender.send(message.chat.id,
             `Command ${message.text} not found. \n You can view the available commands by typing /command_list`);
    }

    private async HandleOptions(message: TelegramBot.Message): Promise<void> {

    }

    private async handlePurchase(message: TelegramBot.Message): Promise<void> {
         if (!message.text) {
             return this.messageSender.send(message.chat.id, "You must add data");
         }
         const purchases: Purchase[] = await Parser.parse(message.text);
         await DataCollector.collect(purchases);
    }

    private async handleCommandList(message: TelegramBot.Message): Promise<void> {

    }
}