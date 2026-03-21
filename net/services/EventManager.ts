import {IBotEvent} from "./interfaces/IBotEvent";
import {EventListener} from "../utils/EventListener";

export class EventManager implements IBotEvent {
    private observers: EventListener[] = [];

    async subscribe(observer: EventListener): Promise<void> {
        this.observers.push(observer);
    }

    async unsubscribe(observer: EventListener): Promise<void> {
        this.observers = this.observers.filter(o => o !== observer);
    }

    async notify(data: any): Promise<void> {
        for (const observer of this.observers) {
            observer.update(data);
        }
    }
}