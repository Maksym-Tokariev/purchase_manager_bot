import {IInputSource} from "../../models/IInputSource";

export interface IStrategy {
    handle(input: IInputSource): Promise<void>;

    canHandle(input: IInputSource): boolean | undefined;
}