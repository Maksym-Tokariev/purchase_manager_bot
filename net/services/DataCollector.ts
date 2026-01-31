import {Purchase} from "../Components/Purchase";

class DataCollector {
    private static data: Purchase[] = [];

    public static async collect(purchases: Purchase[]): Promise<void> {
        for (const pur of purchases) {
            console.log(`Purchase added : ${pur.name} | ${pur.price}`);
            this.data.push(pur);
        }
    }

    public static getData(): Purchase[] {
        return this.data;
    }
}

export default DataCollector