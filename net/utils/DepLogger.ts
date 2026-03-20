import {LOG_LEVEL, LOG_LEVELS, LogLevel} from "../config/Logging";
import {config} from "../config/Config";
import {getContext} from "./Context";

export class DepLogger {
    private static readonly level: LogLevel = config.logging.level;

    private static formatMessage(level: LogLevel, message: string, context?: string): string {
        const parts: string[] = [];
        if (config.logging.showTimestamp) {
            parts.push(`[${new Date().toISOString()}]`);
        }
        if (config.logging.showLevel) {
            parts.push(`[${level.toUpperCase()}]`);
        }
        if (config.logging.showContext) {
            parts.push(`[${context}]`);
        }
        parts.push(message);
        return parts.join(' ');
    }

    private static shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
    }

    public static debug(obj: any, message: string, data?: any): void {
        if (this.shouldLog(LOG_LEVEL.DEBUG)) {
            const context: string = getContext(obj);
            const formatted = this.formatMessage(LOG_LEVEL.DEBUG, message, context);
            if (data) {
                console.debug(formatted, data);
            } else {
                console.debug(formatted);
            }
        }
    }

    public static info(obj: any, message: string, data?: any,): void {
        if (this.shouldLog(LOG_LEVEL.INFO)) {
            const context: string = getContext(obj);
            const formatted = this.formatMessage(LOG_LEVEL.INFO, message, context);
            if (data) {
                console.info(formatted, data);
            } else {
                console.info(formatted);
            }
        }
    }

    public static warn(obj: any, message: string, data?: any): void {
        if (this.shouldLog(LOG_LEVEL.WARN)) {
            const context: string = getContext(obj);
            const formatted: string = this.formatMessage(LOG_LEVEL.WARN, message, context);
            if (data) {
                console.warn(formatted, data);
            } else {
                console.warn(formatted);
            }
        }
    }

    public static error(obj: any, message: string, data?: any): void {
        if (this.shouldLog(LOG_LEVEL.ERROR)) {
            const context: string = getContext(obj);
            const formatted: string = this.formatMessage(LOG_LEVEL.ERROR, message, context);
            if (data) {
                console.error(formatted, data);
            } else {
                console.error(formatted);
            }
        }
    }
}