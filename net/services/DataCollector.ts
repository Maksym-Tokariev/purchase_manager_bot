import {Purchase} from "../Components/Purchase";

class DataCollector {
    private static data: Purchase[] = [];

    public static async collect(purchases: Purchase[]): Promise<void> {
        for (const pur in purchases) {
            this.data.push();
        }
    }

    public static getData(): Purchase[] {
        return this.data;
    }
}

export default DataCollector