import {Purchase} from "../models/Purchase";
import {MongoService} from "./MongoService";
import {Logger} from "../utils/Logger";
import {Formatter} from "../utils/Formatter";
import {DateFormate} from "../errors/DateFormate";
import {PurchaseDTO} from "../models/PurchaseDTO";
import {DeleteResult} from "mongodb";


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

    public async deletePurchase(purchaseId: string): Promise<DeleteResult | undefined> {
        try {
            return  await this.mongo.delete(purchaseId);
        } catch (err: any) {
            Logger.error(this, err.message, err.stack);
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
            let value: string = `${element.name} | ${element.price} | ${date.value}`;
            let purchase: PurchaseDTO = {} as PurchaseDTO;

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