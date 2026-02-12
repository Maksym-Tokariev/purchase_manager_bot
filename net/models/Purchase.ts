export interface Purchase {
    name: string;
    price: number;
    date?: Date;
    tag?: string;
    userId?: number;
    chatId?: number;
    purchaseId?: string;
}