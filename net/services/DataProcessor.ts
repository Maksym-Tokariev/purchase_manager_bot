import {Purchase} from "../models/Purchase";
import {MongoService} from "./MongoService";
import {PurchaseState} from "../models/PurchaseState";


export class DataProcessor {
    private mongo: MongoService;

    constructor(mongo: MongoService) {
        this.mongo = mongo;
    }

    public async addPurchase(purchase: Purchase): Promise<void> {
        try {
            await this.mongo.insert(purchase);
        } catch (err) {
            console.log("Error adding purchase: ", purchase);
            throw err;
        }
    }

    public async getLastPurchases(limit: number): Promise<string> {
        if (!this.mongo.getPurchases()) throw new Error("No purchases collection");
        const data = await this.mongo.getPurchases()!
            .find({})
            .sort({_id: -1})
            .limit(limit)
            .toArray();
        return await this.convertPurchasesToString(data);
    }

    private async convertPurchasesToString(purchases: Purchase[]): Promise<string> {
        let list: string = "Name | Price | Date\n";

        purchases.forEach(pur => {
            list += pur.name;
            list += " | "
            list += pur.price;
            list += " | ";
            list += pur.date;
            list += "\n"
        });
        return list;
    }

    private format(list: Purchase[]): string[] {
        return [""];
    }
}