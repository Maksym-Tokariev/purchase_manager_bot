import {Collection, Db, DeleteResult, MongoClient, WithId} from "mongodb";
import {Purchase} from "../Components/Purchase";

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
            console.log(`Connect to db: ${this.dbName}`);
        } catch (err) {
            console.log("Db connection error: ", err);
            throw err;
        }
    }

    public async disconnect(): Promise<void> {
        await this.client.close();
        console.log("Connected has been closed");
    }

    public async insert(purchase: Purchase): Promise<void> {
        if (!this.purchases) throw new Error("No purchases collection");
        await this.purchases.insertOne(purchase);
    }

    public async find(query: Partial<Purchase>): Promise<WithId<Purchase>[]> {
        if (!this.purchases) throw new Error("No purchases collection");
        return await this.purchases.find(query).toArray();
    }

    public async update(id: string, update: Partial<Purchase>): Promise<number> {
        if (!this.purchases) throw new Error("No purchases collection");
        const res = await this.purchases.updateOne(
            {_id: new Object(id)},
            {$set: update}
        );
        return res.modifiedCount;
    }

    public async delete(id: string): Promise<number> {
        if (!this.purchases) throw new Error("No purchases collection");
        const res: DeleteResult = await this.purchases.deleteOne({_id: new Object(id)});
        return res.deletedCount;
    }

    public getPurchases(): Collection<Purchase> | undefined {
        return this.purchases;
    }
}