import {Bot} from "./Bot"

const bot = new Bot();
bot.start()
    .then(() => {
        console.log("Bot has been started")
    })
    .catch(err => {
        console.log("Bot error ", err.message);
        bot.stop();
        process.exit(1);
    });