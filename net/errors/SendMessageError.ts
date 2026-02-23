export class SendMessageError extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = "SendMessageError"
    }
}