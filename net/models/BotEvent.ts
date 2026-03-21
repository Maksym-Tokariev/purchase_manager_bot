import {IInputSource} from "./IInputSource";

export interface BotEvent {
    type: string;
    payload: IInputSource;
}