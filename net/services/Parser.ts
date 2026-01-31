import {Purchase} from "../Components/Purchase";

export class Parser {
    public static async parse(purchase: string): Promise<Purchase[]> {
        const pur: Purchase[] = [];

        if (purchase.startsWith("-l")) {
            await this.parseList(purchase);
        } else {
            pur.push(await this.parseOne(purchase));
        }

        return pur;
    }

    private static async parseOne(purchase: string): Promise<Purchase> {
        const data: string[] = purchase.split(",");
        const note: Purchase = {} as Purchase;

        note.name = data[0].trim();
        note.price = data[1].trim();
        if (data.length > 2) {
            note.date = data[2].trim();
        } else
            note.date = new Date().toLocaleDateString();
        return note;
    }

    private static async parseList(purchases: string) {

    }
}