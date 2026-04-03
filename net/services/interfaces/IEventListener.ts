export interface IEventListener {
    update(data: any): Promise<void>;
}