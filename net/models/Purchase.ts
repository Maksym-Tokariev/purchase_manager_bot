export interface Purchase {
    name: string;
    price: string;
    date?: string;
    tag?: string;
    userId?: number;
    chatId?: number;
    purchaseId?: string;
}