import {EventListener} from "../event/EventListener";

export interface IObservable {
    subscribe(observer: EventListener): Promise<void>;
    unsubscribe(observer: EventListener): Promise<void>;
    notify(data: any): Promise<void>;
}