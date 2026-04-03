import {IEventListener} from "./IEventListener";

export interface IObservable {
    subscribe(observer: IEventListener): Promise<void>;
    unsubscribe(observer: IEventListener): Promise<void>;
    notify(data: any): Promise<void>;
}