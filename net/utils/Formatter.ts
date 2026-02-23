import {PurchaseState} from "../models/PurchaseState";
import {Purchase} from "../models/Purchase";
import {generatePurchaseId} from "./IDGenerator";
import {DateFormate} from "../models/DateFormate";

export class Formatter {

    public static stripCommand(input: string): string {
        let result: string = "";
         const indexOfSpace = input.indexOf(" ");
         result += input.substring(indexOfSpace, input.length).trim();

        return result;
    }

    public static getId(input: string): number {
        let res: string = "";
        const indexOfUserId = input.indexOf(":");
        res += input.substring(indexOfUserId + 1, input.length).trim();

        const resInt: number = parseInt(res, 10);

        if (isNaN(resInt))
            return 0;
        else
            return resInt;
    }

    public static getPurchaseId(query: string): string {
        const index = query.indexOf(":");
        return query.substring(index + 1, query.length).trim();
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

    public static date(date: Date | undefined): DateFormate {
        if (!date) {
            return {
                value: date,
                error: "Date is invalid or undefined"
            }
        }

        const day: string = String(date.getDay()).padStart(2, "0");
        const month: string = String(date.getMonth() + 1).padStart(2, "0");
        const year: string = String(date.getFullYear());

        return {
            value: `${day}.${month}.${year}`,
            error: null
        }
    }
}