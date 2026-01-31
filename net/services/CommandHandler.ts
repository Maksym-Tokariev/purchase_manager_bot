import TelegramBot, {BotCommand, Message} from "node-telegram-bot-api";
import {CommandService} from "./CommandService";
import {MessageSender} from "./MessageSender";
import {Purchase} from "../Components/Purchase";
import {Parser} from "./Parser";
import DataCollector from "./DataCollector";
import {DataProcessor} from "./DataProcessor";

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
        else if (command.startsWith("/purchase"))
            await this.handlePurchase(message);
        else if (command === "/command_list_help")
            await this.handleCommandList(message);
        else if (command === "/get_data")
            await this.handleGetData(message);
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
            "Send purchase detail using this template: \n/purchase [product name, price, date as dd.MM.yyyy(optional)]\n"
            + "You can also send me list for example: /purchase -l [\nproduct one, price one; \nproduct two, price; \n...\n]\n"
            + "You may omit the purchase time; in this case, I will save the dispatch time as the purchase time.\n"
        );
    }

    private async handleRef(message: Message): Promise<void> {
        const link = `${process.env.URL_TO_BOT}?start=ref_${message.from?.id}`
        await this.messageSender.send(message.chat.id, `Your referral link: ${link}`);
    }

    private async commandNotFound(message: Message): Promise<void> {
        await this.messageSender.send(message.chat.id,
            `Command ${message.text} not found. \n You can view the available commands by typing /command_list_help`);
    }

    private async HandleOptions(message: Message): Promise<void> {
        await this.messageSender.send(message.chat.id, "The command is not ready yet");
    }

    private async handlePurchase(message: Message): Promise<void> {
        if (!message.text) {
            await this.messageSender.send(message.chat.id, "Empty value");
            return;
        }

        const data: string = message.text?.substring(9, message.text.length).trim()
            .replace(/^\[|\]$/g, "");

        console.log(`Data : ${data}`);

        if (data.length < 2) {
            await this.messageSender.send(message.chat.id, `You have not added any data.\nIt should be like this /purchase [bread, 4.65, ${new Date().toLocaleDateString()}]`);
            return;
        }

        const purchases: Purchase[] = await Parser.parse(data);
        await DataCollector.collect(purchases);

        await this.messageSender.send(message.chat.id, "Your purchase has been added");
    }

    private async handleCommandList(message: Message): Promise<void> {
        await this.messageSender.send(message.chat.id, "The command is not ready yet");
    }

    private async handleGetData(message: Message): Promise<void> {
        const data: Purchase[] = await DataProcessor.createDataList();

        if (data.length > 0) {
            try {
                let list: string = "Name | Price | Date \n";
                for (const purchase of data) {
                    list += purchase.name;
                    list += " | "
                    list += purchase.price;
                    list += " | "
                    list += purchase.date
                    list += "\n";
                }
                await this.messageSender.send(message.chat.id, list);
            } catch (err) {
                console.log(err);
            }
        } else
            await this.messageSender.send(message.chat.id, "Your shopping list is empty.\nAdd purchases and try again");
    }
}