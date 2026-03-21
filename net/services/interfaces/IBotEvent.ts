import {EventListener} from "../../utils/EventListener";

export interface IBotEvent {
    subscribe(observer: EventListener): Promise<void>;
    unsubscribe(observer: EventListener): Promise<void>;
    notify(data: any): Promise<void>;
}