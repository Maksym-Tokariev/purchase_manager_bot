import {PurchaseStep} from "./PurchaseStep";

export interface PurchaseState {
    userId: number;
    chatId: number;
    currentStep: PurchaseStep;
    currentFlow?: string;
    data: {
      name?: string;
      price?: number;
      date?: Date;
      category?: string;
    }
}