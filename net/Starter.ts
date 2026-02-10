import {Bot} from "./Bot"
import {Logger} from "./utils/Logger";
import {getContext} from "./utils/Context";

const bot = new Bot();
bot.start()
    .then(() => {
        Logger.info("{Starter} Bot has been started")
    })
    .catch(err => {
        Logger.error("{Starter} Bot error ", getContext(this), err.message);
        bot.stop();
        process.exit(1);
    });