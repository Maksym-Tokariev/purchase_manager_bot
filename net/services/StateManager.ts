import {PurchaseState} from "../models/PurchaseState";
import {PurchaseStep} from "../models/PurchaseStep";
import {Purchase} from "../models/Purchase";
import {Formatter} from "../utils/Formatter";
import {Logger} from "../utils/Logger";

export class StateManager {
    private readonly logger = new Logger(StateManager.name);
    private states: Map<number, PurchaseState[]> = new Map();

    public getStack(userId: number): PurchaseState[] {
        return this.states.get(userId) ?? [];
    }
    
    public getCurrState(userId: number): PurchaseState {
        const stack: PurchaseState[] = this.getStack(userId);
        return stack[stack.length - 1];
    }

    public isInFlow(userId: number): boolean {
        const curr = this.getCurrState(userId);
        return curr !== undefined && curr.currentStep !== PurchaseStep.IDLE;
    }

    public startFlow(userId: number, chatId: number, step: PurchaseStep, flowName: string): void {
        this.logger.debug('Start flow to a user', userId);
        const stack = this.getStack(userId);
        stack.push({
            userId,
            chatId,
            currentStep: step,
            currentFlow: flowName,
            data: {}
        });
        this.states.set(userId, stack);
        this.logger.debug('User flows: ', stack);
    }

    updateStep(userId: number, step: PurchaseStep): void {
        const state = this.getCurrState(userId);
        if (state) state.currentStep = step;
    }

    updateData(userId: number, data: Partial<PurchaseState['data']>): void {
        const curr = this.getCurrState(userId);
        if (curr) curr.data = {...curr.data, ...data};
    }

    completeFlow(userId: number, chatId: number): Purchase | null {
        const stack = this.getStack(userId);
        const curr = stack.pop();

        if (!curr) return null;

        const data = Formatter.toPurchase(curr);

        this.logger.debug("Flow completed for user:", userId);
        return data;
    }

    cancelFlow(userId: number, chatId: number): void {
        const stack = this.getStack(userId);
        const curr = stack.pop();

        if (curr) {
            this.logger.debug("Flow cancelled for user:", userId);
        }
    }

    public resetAllFlows(userId: number): void {
        this.states.set(userId, []);
        this.logger.debug("All flows reset for user:", userId);
    }
}