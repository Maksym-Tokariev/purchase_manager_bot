import {Bot} from "./Bot"
import {Logger} from "./utils/Logger";

const bot = new Bot();
bot.start()
    .then(() => {
        Logger.info("Starter","Bot has been started")
    })
    .catch(err => {
        Logger.error("Starter"," Bot error ", err.message);
        bot.stop();
        process.exit(1);
    });