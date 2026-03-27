import {IBotEvent} from "./interfaces/IBotEvent";
import {EventListener} from "../utils/EventListener";
import {IInputSource} from "../models/IInputSource";
import {Logger} from "../utils/Logger";

export class EventManager implements IBotEvent {
    private logger = new Logger(EventManager.name);
    private observers: EventListener[] = [];

    async subscribe(observer: EventListener): Promise<void> {
        this.observers.push(observer);
    }

    async unsubscribe(observer: EventListener): Promise<void> {
        this.observers = this.observers.filter(o => o !== observer);
    }

    async notify(event: IInputSource): Promise<void> {
        this.logger.debug('Notify observers');
        for (const observer of this.observers) {
            observer.update(event);
        }
    }
}