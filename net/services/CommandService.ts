import {Commands} from "../config/Commands";
import TelegramBot, {BotCommand} from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";

export class CommandService {
    private bot: TelegramBot;
    private commands: BotCommand[] = [];

    constructor(bot: TelegramBot) {
        this.bot = bot;
    }

    public async setCommandsList(): Promise<void>  {
        Logger.debug(this, "Command initialization");
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