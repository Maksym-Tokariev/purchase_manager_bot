import {PurchaseState} from "../models/PurchaseState";
import {PurchaseStep} from "../models/PurchaseStep";
import {Logger} from "../utils/Logger";
import {getContext} from "../utils/Context";
import {Purchase} from "../models/Purchase";
import {Formatter} from "../utils/Formatter";

export class StateManager {
    private states: Map<number, PurchaseState> = new Map();

    public getCurrState(userId: number): PurchaseState | undefined {
        return this.states.get(userId);
    }

    public isInFlow(userId: number): boolean {
        const state = this.states.get(userId);
        return state !== undefined && state.currentStep !== PurchaseStep.IDLE;
    }

    startFlow(userId: number, chatId: number): void {
        this.states.set(userId, {
            userId: userId,
            chatId: chatId,
            currentStep: PurchaseStep.NAME,
            data: {}
        });
    }

    updateStep(userId: number, step: PurchaseStep): void {
        const state = this.states.get(userId);
        if (state) state.currentStep = step;
    }

    updateData(userId: number, data: Partial<PurchaseState['data']>): void {
        const state = this.states.get(userId);
        if (state) state.data = {...state.data, ...data};
    }

    completeFlow(userId: number, chatId: number): Purchase | null {
        const state = this.states.get(userId);

        if (!state) return null;

        const data = Formatter.toPurchase(state);

        this.clearState(userId, chatId);

        Logger.debug("Flow completed for user: ", getContext(this), userId);
        return data;
    }

    cancelFlow(userId: number, chatId: number): void {
        this.clearState(userId, chatId);
        Logger.debug("Flow cancelled for user: ", getContext(this), userId);
    }


    private clearState(userId: number, chatId: number): void {
        this.states.set(userId, {
            userId: userId,
            chatId: chatId,
            currentStep: PurchaseStep.IDLE,
            data: {}
        });
    }
}