import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});

export const config = {
    token: process.env.API_KEY_BOT || "",
};