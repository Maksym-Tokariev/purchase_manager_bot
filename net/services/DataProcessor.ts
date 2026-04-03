import {Purchase} from "../models/Purchase";
import {MongoService} from "./MongoService";
import {Formatter} from "../utils/Formatter";
import {DateFormate} from "../models/DateFormate";
import {PurchaseDTO} from "../models/PurchaseDTO";
import {DeleteResult, WithId} from "mongodb";
import {Logger} from "../utils/Logger";


export class DataProcessor {
    private readonly logger = new Logger(DataProcessor.name);
    private mongo: MongoService;

    constructor(mongo: MongoService) {
        this.mongo = mongo;
    }

    public async addPurchase(purchase: Purchase): Promise<void> {
        try {
            await this.mongo.insert(purchase);
        } catch (err) {
            this.logger.error("Error adding purchase:", purchase);
            throw err;
        }
    }

    public async deletePurchase(purchaseId: string): Promise<DeleteResult | undefined> {
        try {
            return  await this.mongo.delete(purchaseId);
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
        }
    }

    public async editPurchase(purchaseId: string, input: Partial<Purchase>): Promise<void> {
        try {
            await this.mongo.update(purchaseId, input);
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
        }
    }

    public async getPurchase(purchaseId: string): Promise<WithId<Purchase> | null> {
        try {
            return await this.mongo.find(purchaseId);
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
            return null;
        }
    }

    public async getLastPurchases(userId: number, limit: number): Promise<PurchaseDTO[]> {
        if (!this.mongo.getPurchases() || this.mongo.getPurchases() === undefined) throw new Error("No purchases collection");
        const data = await this.mongo.getPurchases()!
            .find({ userId: userId })
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
                this.logger.warn("Purchase without id", element)
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