import TelegramBot, {BotCommand, Message} from "node-telegram-bot-api";
import {CommandService} from "./CommandService";
import {MessageSender} from "./MessageSender";
import {Purchase} from "../models/Purchase";
import {MongoService} from "./MongoService";
import {DataProcessor} from "./DataProcessor";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";
import {Formatter} from "../utils/Formatter";
import {PurchaseFlowService} from "./PurchaseFlowService";

export class CommandHandler {
    private commandService: CommandService;
    private dataProcessor: DataProcessor;

    constructor(
        private readonly messageSender: MessageSender,
        private bot: TelegramBot,
        private purchaseFlowService: PurchaseFlowService,
        mongo: MongoService
    ) {
        this.dataProcessor = new DataProcessor(mongo);
        this.commandService = new CommandService(bot);
        this.commandService.setCommandsList()
            .then(() => Logger.info("Commands have been set",getContext(this)))
            .catch(err => Logger.error("Error installing commands", getContext(this), err.message));
        Logger.debug("Command handler was initialized", getContext(this));
    }

    public async handle(message: Message): Promise<void> {
        Logger.debug(`Command from ${message.from?.username} : ${message.text}`, getContext(this));

        const command: string = message.text!.split(" ")[0];

        if (command === "/start")
            await this.handleStart(message);
        else if (command === "/help")
            await this.handleHelp(message);
        else if (command === "/ref")
            await this.handleRef(message);
        else if (command === "/options")
            await this.HandleOptions(message);
        else if (command === "/purchase")
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
            + "You can also send me list for example: /purchase -l \n[\nproduct one, price one; \nproduct two, price; \n...\n]\n"
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
        const chatId: number | undefined = message ? message.chat.id : undefined;
        const userId: number | undefined = message ? message.from?.id : undefined;

        if (!chatId || !userId) {
            Logger.error("Chat or user id is undefined: ", getContext(this), {userId, chatId});
            return;
        }

        if (!message.text) {
            await this.messageSender.send(message.chat.id, "Empty value");
            return;
        }

        const input: string = Formatter.stripCommand(message.text);

        Logger.debug("Data: ", getContext(this), input);

        if (input.length < 2) {
            await this.messageSender.send(message.chat.id,
                `You have not added any data.\nIt should be like this /purchase [bread, 4.65, ${new Date().toLocaleDateString()}]`);
            return;
        }

        await this.purchaseFlowService.startPurchaseFlow(userId, chatId);

        try {
            await this.dataProcessor.addPurchase({} as Purchase);
        } catch (e) {
            Logger.error("Adding error: ", getContext(this), e);
            await this.messageSender.send(message.chat.id, "Your purchase was not added");
        }

        await this.messageSender.send(message.chat.id, "Your purchase has been added");
    }

    private async handleCommandList(message: Message): Promise<void> {
        await this.messageSender.send(message.chat.id, "The command is not ready yet");
    }

    private async handleGetData(message: Message): Promise<void> {
        const data: string = await this.dataProcessor.getLastPurchases(10);

        Logger.info("Data obtained: [%s]", data);
        if (data.length > 0) {
            try {
                await this.messageSender.send(message.chat.id, data);
            } catch (err) {
                Logger.error("Message send error", getContext(this), err);
            }
        } else
            await this.messageSender.send(message.chat.id, "Your shopping list is empty.\nAdd purchases and try again");
    }
}