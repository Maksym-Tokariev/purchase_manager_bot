import crypto from "crypto";
import {Logger} from "./Logger";

const logger = new Logger('IDGenerator');

export function generatePurchaseId(userId: number): string {
    const randomHash = crypto.randomBytes(4).toString("hex").substring(0, 6);
    logger.debug(`Generated purchase id: ${userId}-${randomHash}`);
    return `${userId}-${randomHash}`;
}