import crypto from "crypto";
import {Logger} from "./Logger";

export function generatePurchaseId(userId: number): string {
    const randomHash = crypto.randomBytes(4).toString("hex").substring(0, 6);
    Logger.debug("Generated purchase id:", "generatePurchaseId", `${userId}-${randomHash}`);
    return `${userId}-${randomHash}`;
}