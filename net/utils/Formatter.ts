import {PurchaseState} from "../models/PurchaseState";
import {Purchase} from "../models/Purchase";
import {generatePurchaseId} from "./IDGenerator";

export class Formatter {

    public static stripCommand(input: string): string {
        let result: string = "";
         const indexOfSpace = input.indexOf(" ");
         result += input.substring(indexOfSpace, input.length).trim();

        return result;
    }

    public static getUserId(input: string): number {
        let res: string = "";
        const indexOfUserId = input.indexOf(":");
        res += input.substring(indexOfUserId + 1, input.length).trim();

        const resInt: number = parseInt(res, 10);

        if (isNaN(resInt))
            return 0;
        else
            return resInt;
    }

    public static toPurchase(state: PurchaseState): Purchase {
        return {
            name: state.data.name ?? "",
            price: state.data.price ?? 0,
            date: state.data.date,
            tag: "",
            userId: state.userId,
            chatId: state.chatId,
            purchaseId: generatePurchaseId(state.userId)
        }
    }
}