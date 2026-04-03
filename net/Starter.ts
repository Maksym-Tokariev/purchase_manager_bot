import {Bot} from "./Bot"
import {Logger} from "./utils/Logger";

const bot = new Bot();
const logger = new Logger('Starter');
bot.start()
    .then(() => {
        logger.info("Bot has been started")
    })
    .catch(err => {
        logger.error(" Bot error ", err.message);
        bot.stop();
        process.exit(1);
    });