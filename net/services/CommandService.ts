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
        })
        this.commands.push({
            command: COMMANDS.HELP,
            description: "Supplementary information"
        })

        await this.bot.setMyCommands(this.commands);
    }

    public getCommands(): BotCommand[] {
        return this.commands;
    }
}