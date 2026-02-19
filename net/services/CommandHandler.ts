import TelegramBot, {Message} from "node-telegram-bot-api";
import {CommandService} from "./CommandService";
import {MessageSender} from "./MessageSender";
import {DataProcessor} from "./DataProcessor";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";
import {Formatter} from "../utils/Formatter";
import {PurchaseFlowService} from "./PurchaseFlowService";
import {Keyboards} from "../keyboards/Keyboards";

export class CommandHandler {
    private commandService: CommandService;

    constructor(
        private bot: TelegramBot,
        private purchaseFlowService: PurchaseFlowService,
        private dataProcessor: DataProcessor
    ) {

        this.commandService = new CommandService(bot);
        this.commandService.setCommandsList()
            .then(() => Logger.info(this, "Commands have been set"))
            .catch(err => Logger.error(this, "Error installing commands", err.message));
        Logger.debug(this, "Command handler was initialized");
    }

    async handle(message: Message): Promise<void> {
        Logger.debug(this, `Command from ${message.from?.username} : ${message.text}`);

        const command: string = message.text!.split(" ")[0];

        if (command === "/start")
            await this.handleStart(message);
        else if (command === "/help")
            await this.handleHelp(message);
        else if (command === "/ref")
            await this.handleRef(message);
        else if (command === "/options")
            await this.HandleOptions(message);
        else if (command === "/add")
            await this.handlePurchase(message);
        else if (command === "/command_list_help")
            await this.handleCommandList(message);
        else if (command === "/history")
            await this.handleHistory(message);
        else
            await this.commandNotFound(message);
    }

    private async handleStart(message: Message): Promise<void> {
        if (message.text?.length! > 6) {
            const refID = message.text?.slice(7)!;


            await this.bot.sendMessage(message.chat.id, `You followed the link user with ID ${refID}`)
        }

        const name: string = message.from?.first_name ? message.from?.first_name! : message.from?.username!

        await this.bot.sendMessage(message.chat.id,
            `Hello, ${name}. \nWith my help you can track your spending.\nSend me what you bought ande when, and I'll compile statistics for you`);
    }

    private async handleHelp(message: Message): Promise<void> {
        await this.bot.sendMessage(message.chat.id,
            "Send purchase detail using /add, next follow the instruction"
        );
    }

    private async handleRef(message: Message): Promise<void> {
        const link = `${process.env.URL_TO_BOT}?start=ref_${message.from?.id}`
        await this.bot.sendMessage(message.chat.id, `Your referral link: ${link}`);
    }

    private async commandNotFound(message: Message): Promise<void> {
        await this.bot.sendMessage(message.chat.id,
            `Command ${message.text} not found. \n You can view the available commands by typing /command_list_help`, {
            reply_markup: Keyboards.getCommandListButtons()
        });
    }

    private async HandleOptions(message: Message): Promise<void> {
        await this.bot.sendMessage(message.chat.id, "The command is not ready yet");
    }

    private async handlePurchase(message: Message): Promise<void> {
        const chatId: number | undefined = message ? message.chat.id : undefined;
        const userId: number | undefined = message ? message.from?.id : undefined;

        if (!chatId || !userId) {
            Logger.error(this, "Chat or user id is undefined: ", {userId, chatId});
            return;
        }

        if (!message.text) {
            await this.bot.sendMessage(message.chat.id, "Empty value");
            return;
        }

        const input: string = Formatter.stripCommand(message.text);

        if (input.length < 2) {
            await this.bot.sendMessage(message.chat.id,
                `You have not added any data.\nIt should be like this /purchase [bread, 4.65, ${new Date().toLocaleDateString()}]`);
            return;
        }

        await this.purchaseFlowService.startPurchaseFlow(userId, chatId);
    }

    private async handleCommandList(message: Message): Promise<void> {
        await this.bot.sendMessage(message.chat.id, "The command is not ready yet");
    }

    private async handleHistory(message: Message): Promise<void> {
        try {
            const data: string = await this.dataProcessor.getLastPurchases(10);

            Logger.info(this, "Data obtained", data);
            if (data.length > 0) {
                try {
                    await this.bot.sendMessage(message.chat.id, data);
                } catch (err) {
                    Logger.error("Message send error", getContext(this), err);
                }
            } else
                await this.bot.sendMessage(message.chat.id, "Your shopping list is empty.\nAdd purchases and try again");
        } catch (err: any) {
            Logger.error(this, "Handle history error:", err);
        }
    }
}