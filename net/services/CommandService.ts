import {COMMANDS} from "../config/Commands";

export class CommandService {
    private commands: string[] = [];

    public async setCommandsList(): Promise<void>  {
        for (const command in COMMANDS) {
            console.log(`Command has been set [${command}]`);
            this.commands.push(command);
        }
    }

    public getCommands(): string[] {
        return this.commands;
    }
}