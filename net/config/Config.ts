import * as dotenv from 'dotenv';
import * as path from 'path';
import {LOG_LEVEL} from "./Logging";

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});

export const config = {
    token: process.env.API_KEY_BOT || "",
    history_limit: 10,
    mongo: {
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME
    },
    logging: {
        level: LOG_LEVEL.DEBUG,
        showTimestamp: true,
        showLevel: true,
        showContext: true
    }
};