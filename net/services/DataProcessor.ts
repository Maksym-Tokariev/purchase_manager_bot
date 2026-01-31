import {Purchase} from "../Components/Purchase";
import DataCollector from "./DataCollector";

export class DataProcessor {

    public static async createDataList(): Promise<Purchase[]> {
        return DataCollector.getData();
    }

    private format(list: Purchase[]): string[] {
        return [""];
    }
}