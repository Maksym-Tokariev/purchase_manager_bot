import {Commands} from "../config/Commands";
import TelegramBot, {BotCommand} from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";

export class CommandRegistry {
    private bot: TelegramBot;
    private commands: BotCommand[] = [];

    constructor(bot: TelegramBot) {
        this.bot = bot;
    }

    public async setCommandsList(): Promise<void>  {
        Logger.debug(this, "Command initialization");
        this.commands.push({
            command: Commands.START,
            description: "Launching the bot"
        });
        this.commands.push({
            command: Commands.REF,
            description: "Get a referral link"
        });
        this.commands.push({
            command: Commands.HELP,
            description: "Supplementary information"
        });
        this.commands.push({
            command: Commands.OPTIONS,
            description: "Show bot options"
        });
        this.commands.push({
            command: Commands.ADD,
            description: "Send me your purchase"
        });
        this.commands.push({
            command: Commands.COMMAND_LIST,
            description: "Information about commands"
        });
        this.commands.push({
            command: Commands.HISTORY,
            description: "Show your shopping list"
        });

        try {
            await this.bot.setMyCommands(this.commands);
        } catch (err: any) {
            throw Error(err);
        }
    }

    public getCommands(): BotCommand[] {
        return this.commands;
    }
}