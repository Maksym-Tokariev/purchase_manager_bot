export interface PurchaseState {
    userId: number;
    chatId: number;
    data: {
      name?: string;
      price?: number;
      date?: Date;
      category?: string;
    }
}