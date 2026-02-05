import {Commands} from "../config/Commands";
import TelegramBot, {BotCommand} from "node-telegram-bot-api";

export class CommandService {
    private bot: TelegramBot;
    private commands: BotCommand[] = [];

    constructor(bot: TelegramBot) {
        this.bot = bot;
    }

    public async setCommandsList(): Promise<void>  {
        this.commands.push({
            command: Commands.start,
            description: "Launching the bot"
        });
        this.commands.push({
            command: Commands.ref,
            description: "Get a referral link"
        });
        this.commands.push({
            command: Commands.help,
            description: "Supplementary information"
        });
        this.commands.push({
            command: Commands.options,
            description: "Show bot options"
        });
        this.commands.push({
            command: Commands.add,
            description: "Send me your purchase"
        });
        this.commands.push({
            command: Commands.commandList,
            description: "Information about commands"
        });
        this.commands.push({
            command: Commands.history,
            description: "Show your shopping list"
        });

        await this.bot.setMyCommands(this.commands);
    }

    public getCommands(): BotCommand[] {
        return this.commands;
    }
}