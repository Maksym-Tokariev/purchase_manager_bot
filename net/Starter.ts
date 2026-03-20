import {Bot} from "./Bot"
import {DepLogger} from "./utils/DepLogger";

const bot = new Bot();
bot.start()
    .then(() => {
        DepLogger.info("Starter","Bot has been started")
    })
    .catch(err => {
        DepLogger.error("Starter"," Bot error ", err.message);
        bot.stop();
        process.exit(1);
    });