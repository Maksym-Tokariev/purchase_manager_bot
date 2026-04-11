export class StrategyError extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = "StrategyError"
    }
}