import {Purchase} from "../Components/Purchase";

export class Parser {
    public static async parse(purchase: string): Promise<Purchase[]> {
        const pur: Purchase[] = [];
        pur.push({purchase: "df", price: 4.65} as Purchase)
        return pur;
    }
}