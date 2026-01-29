import TelegramBot from "node-telegram-bot-api";

export class MessageSender {
    private bot: TelegramBot;

    constructor(bot: TelegramBot) {
        this.bot = bot;
    }

    public async send(chatId: any, arg: any): Promise<void> {
        await this.bot.sendMessage(chatId, arg);
    }
}