import TelegramBot, {Message} from "node-telegram-bot-api";
import {CommandRegistry} from "../CommandRegistry";
import {DataProcessor} from "../DataProcessor";
import {Logger} from "../../utils/Logger";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {Keyboards} from "../../keyboards/Keyboards";
import {PurchaseDTO} from "../../models/PurchaseDTO";
import {MessageSender} from "../MessageSender";
import {config} from "../../config/Config";

export class CommandHandler {
    private commandService: CommandRegistry;

    constructor(
        private bot: TelegramBot,
        private flow: PurchaseFlowService,
        private dataProcessor: DataProcessor,
        private sender: MessageSender
    ) {

        this.commandService = new CommandRegistry(bot);
        this.commandService.setCommandsList()
            .then(() => Logger.info(this, "Commands have been set"))
            .catch(err => Logger.error(this, "Error installing commands", err.message));
        Logger.info(this, "Command handler was initialized");
    }

    async handle(message: Message): Promise<void> {
        Logger.debug(this, `Command from ${message.from?.username} : ${message.text}`);

        const command: string = message.text!.split(" ")[0];

        if (command === "/start")
            await this.handleStart(message);
        else if (command === "/help")
            await this.handleHelp(message.chat.id);
        else if (command === "/ref")
            await this.handleRef(message.from?.id!, message.chat.id);
        else if (command === "/options")
            await this.HandleOptions(message);
        else if (command === "/add")
            await this.handleAdd(message);
        else if (command === "/command_list_help")
            await this.handleCommandList(message);
        else if (command === "/history")
            await this.handleHistory(message.from?.id!, message.chat.id);
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
            `Hello, ${name}. \nWith my help you can track your spending.\nSend me what you bought ande when, and I'll compile statistics for you`, {
                reply_markup: {
                    keyboard: [
                        [{text: "Add"}],
                        [{text: "Help"}],
                        [{text: "History"}]
                    ]
                }
            });
    }

    private async handleHelp(chatId: number): Promise<void> {
        await this.bot.sendMessage(chatId,
            "Send purchase detail using /add, next follow the instruction"
        );
    }

    private async handleRef(userId: number, chatId: number): Promise<void> {
        const link = `${process.env.URL_TO_BOT}?start=ref_${userId}`;
        await this.bot.sendMessage(chatId, `Your referral link: ${link}`);
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

    private async handleAdd(message: Message): Promise<void> {
        const chatId: number = message.chat.id;
        const userId: number | undefined = message ? message.from?.id : undefined;

        if (!userId) {
            Logger.error(this, "User id is undefined: ", {userId});
            return;
        }
        await this.flow.startPurchaseFlow(userId, chatId);
    }

    private async handleCommandList(message: Message): Promise<void> {
        await this.bot.sendMessage(message.chat.id, "The command is not ready yet");
    }

    private async handleHistory(userId: number, chatId: number): Promise<void> {
        const data: PurchaseDTO[] = await this.dataProcessor.getLastPurchases(userId, config.history_limit);
        await this.sender.sendHistory(chatId, data);
    }
}