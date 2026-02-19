import {Purchase} from "../models/Purchase";
import {MongoService} from "./MongoService";
import {Logger} from "../utils/Logger";
import {Formatter} from "../utils/Formatter";
import {DateFormate} from "../errors/DateFormate";
import {PurchaseDTO} from "../models/PurchaseDTO";


export class DataProcessor {
    private mongo: MongoService;

    constructor(mongo: MongoService) {
        this.mongo = mongo;
    }

    public async addPurchase(purchase: Purchase): Promise<void> {
        try {
            await this.mongo.insert(purchase);
        } catch (err) {
            Logger.error(this, "Error adding purchase:", purchase);
            throw err;
        }
    }

    public async getLastPurchases(limit: number): Promise<PurchaseDTO[]> {
        if (!this.mongo.getPurchases() || this.mongo.getPurchases() === undefined) throw new Error("No purchases collection");
        const data = await this.mongo.getPurchases()!
            .find({})
            .sort({_id: -1})
            .limit(limit)
            .toArray();
        return await this.convertPurchasesToString(data);
    }

    private async convertPurchasesToString(purchases: Purchase[]): Promise<PurchaseDTO[]> {
         const list: PurchaseDTO[] = [];

        purchases.forEach(element => {
            const date: DateFormate = Formatter.date(element.date);
            let value: string = ""
            let purchase: PurchaseDTO = {} as PurchaseDTO;


            value += element.name;
            value += " | "
            value += element.price;
            value += " | ";
            value += date.value;
            value += "\n";

            if (!element.purchaseId) {
                Logger.warn(this, "Purchase without id", element)
                return;
            }

            purchase.value = value;
            purchase.id = element.purchaseId;
            purchase.userId = element.userId!;

            list.push(purchase);
        });
        return list;
    }
}