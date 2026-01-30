import {Purchase} from "../Components/Purchase";

export class Parser {
    public static async parse(req: string): Promise<Purchase[]> {
        const pur: Purchase[] = [];

        const purchase: string = req.substring(9, req.length);
        console.log(purchase);

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

        note.purchase = data[0].trim();
        note.price = data[1].trim();
        if (data.length > 2) {
            note.date = data[2].trim();
        }
        return note;
    }

    private static async parseList(purchases: string) {

    }
}