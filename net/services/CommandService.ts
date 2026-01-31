import {COMMANDS} from "../config/Commands";
import TelegramBot, {BotCommand} from "node-telegram-bot-api";

export class CommandService {
    private bot: TelegramBot;
    private commands: BotCommand[] = [];

    constructor(bot: TelegramBot) {
        this.bot = bot;
    }

    public async setCommandsList(): Promise<void>  {
        this.commands.push({
            command: COMMANDS.START,
            description: "Launching the bot"
        });
        this.commands.push({
            command: COMMANDS.REF,
            description: "Get a referral link"
        });
        this.commands.push({
            command: COMMANDS.HELP,
            description: "Supplementary information"
        });
        this.commands.push({
            command: "/options",
            description: "Show bot options"
        });
        this.commands.push({
            command: "/purchase",
            description: "Send me your purchase"
        });
        this.commands.push({
            command: "/command_list_help",
            description: "Information about commands"
        });
        this.commands.push({
            command: "/get_data",
            description: "Show your shopping list"
        });

        await this.bot.setMyCommands(this.commands);
    }

    public getCommands(): BotCommand[] {
        return this.commands;
    }
}