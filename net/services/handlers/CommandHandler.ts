import TelegramBot, {Message} from "node-telegram-bot-api";
import {CommandRegistry} from "../CommandRegistry";
import {DataProcessor} from "../DataProcessor";
import {DepLogger} from "../../utils/DepLogger";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {Keyboards} from "../../keyboards/Keyboards";
import {PurchaseDTO} from "../../models/PurchaseDTO";
import {MessageSender} from "../MessageSender";
import {config} from "../../config/Config";
import {StateManager} from "../StateManager";

export class CommandHandler {
    private commandService: CommandRegistry;
    // private factory: StrategyFactory;

    constructor(
        private bot: TelegramBot,
        private flow: PurchaseFlowService,
        private dataProcessor: DataProcessor,
        private sender: MessageSender,
        private data: DataProcessor,
        private state: StateManager
    ) {
        this.commandService = new CommandRegistry(bot);
        this.commandService.setCommandsList()
            .then(() => DepLogger.info(this, "Commands have been set"))
            .catch(err => DepLogger.error(this, "Error installing commands", err.message));
        DepLogger.info(this, "Command handler was initialized");
    }

    async handle(message: Message): Promise<void> {
        DepLogger.debug(this, `Command from ${message.from?.username} : ${message.text}`);
        try {
        } catch (err: any) {
            DepLogger.error(this, err.message, err.stack);
        }

        const command: string = message.text!.split(" ")[0];

        if (command === "/options")
            await this.HandleOptions(message);
        else if (command === "/add")
            await this.handleAdd(message);
        else if (command === "/command_list_help")
            return;
        else if (command === "/history")
            await this.handleHistory(message.from?.id!, message.chat.id);
        else
            await this.commandNotFound(message);
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
            DepLogger.error(this, "User id is undefined: ", {userId});
            return;
        }
        await this.flow.startAddFlow(userId, chatId);
    }

    private async handleHistory(userId: number, chatId: number): Promise<void> {
        const data: PurchaseDTO[] = await this.dataProcessor.getLastPurchases(userId, config.history_limit);
        await this.sender.sendHistory(chatId, data);
    }
}