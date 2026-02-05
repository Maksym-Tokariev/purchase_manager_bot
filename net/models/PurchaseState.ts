import {PurchaseStep} from "./PurchaseStep";

export interface PurchaseState {
    userId: number;
    chatId: number;
    currentStep: PurchaseStep;
    data: {
      name?: string;
      price?: number;
      date?: Date;
      category?: string;
    }
}