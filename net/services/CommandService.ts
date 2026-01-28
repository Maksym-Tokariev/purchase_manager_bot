import {COMMANDS} from "../config/Commands";
import {CommandHandler} from "../interfaces/CommandHandler";

export class CommandService {
    private commands: CommandHandler[] = [];

    public async setCommands(): Promise<void>  {
        for (const command in COMMANDS) {
            console.log(command)
        }
    }

}