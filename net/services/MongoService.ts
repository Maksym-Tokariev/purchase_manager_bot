import {Collection, Db, DeleteResult, MongoClient, UpdateResult, WithId} from "mongodb";
import {Purchase} from "../models/Purchase";
import {Logger} from "../utils/Logger";

export class MongoService {
    private client: MongoClient;
    private db?: Db;
    private purchases?: Collection<Purchase>

    constructor(private uri: string, private dbName: string) {
        this.client = new MongoClient(uri);
    }

    public async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            this.purchases = this.db.collection<Purchase>("purchases");
            Logger.info(this, "Connect to db:", this.dbName);
        } catch (err) {
            Logger.error(this, "Db connection error: ", err);
            throw err;
        }
    }

    public async disconnect(): Promise<void> {
        await this.client.close();
        Logger.info(this, "Connected has been closed");
    }

    public async insert(purchase: Purchase): Promise<void> {
        if (!this.purchases) throw new Error("No purchases collection");
        await this.purchases.insertOne(purchase);
    }

    public async find(purchaseId: string): Promise<WithId<Purchase> | null> {
        if (!this.purchases) throw new Error("No purchases collection");
        return await this.purchases.findOne({purchaseId: purchaseId});
    }

    public async update(purchaseId: string, update: Partial<Purchase>): Promise<UpdateResult> {
        if (!this.purchases) throw new Error("No purchases collection");
        return await this.purchases.updateOne(
            {purchaseId: purchaseId},
            {$set: update}
        );
    }

    public async delete(purchaseId: string): Promise<DeleteResult> {
        if (!this.purchases) throw new Error("No purchases collection");
        return await this.purchases.deleteOne({purchaseId: purchaseId});
    }

    public getPurchases(): Collection<Purchase> | undefined {
        return this.purchases;
    }
}