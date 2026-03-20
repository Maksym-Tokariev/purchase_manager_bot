import crypto from "crypto";
import {DepLogger} from "./DepLogger";

export function generatePurchaseId(userId: number): string {
    const randomHash = crypto.randomBytes(4).toString("hex").substring(0, 6);
    DepLogger.debug("Generated purchase id:", "generatePurchaseId", `${userId}-${randomHash}`);
    return `${userId}-${randomHash}`;
}