import {LOG_LEVEL, LOG_LEVELS, LogLevel} from "../config/Logging";
import {config} from "../config/Config";

export class Logger {
    private readonly level: LogLevel = config.logging.level;

    constructor(
        private context: string
    ) {}

    private getColor(level: LogLevel): string {
        switch (level) {
            case LOG_LEVEL.DEBUG: return "\x1b[36m";
            case LOG_LEVEL.INFO:  return "\x1b[32m";
            case LOG_LEVEL.WARN:  return "\x1b[33m";
            default: return "\x1b[0m";
        }
    }

    private formatMessage(level: LogLevel, message: string, context?: string): string {
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

        const color = this.getColor(level);
        const reset = "\x1b[0m"
        return `${color}${parts.join(" ")}${reset}`;
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
    }

    public debug(message: string, data?: any): void {
        if (this.shouldLog(LOG_LEVEL.DEBUG)) {
            const formatted = this.formatMessage(LOG_LEVEL.DEBUG, message, this.context);
            if (data) {
                console.debug(formatted, data);
            } else {
                console.debug(formatted);
            }
        }
    }

    public info(message: string, data?: any,): void {
        if (this.shouldLog(LOG_LEVEL.INFO)) {
            const formatted = this.formatMessage(LOG_LEVEL.INFO, message, this.context);
            if (data) {
                console.info(formatted, data);
            } else {
                console.info(formatted);
            }
        }
    }

    public warn(message: string, data?: any): void {
        if (this.shouldLog(LOG_LEVEL.WARN)) {
            const formatted: string = this.formatMessage(LOG_LEVEL.WARN, message, this.context);
            if (data) {
                console.warn(formatted, data);
            } else {
                console.warn(formatted);
            }
        }
    }

    public error(message: string, data?: any): void {
        if (this.shouldLog(LOG_LEVEL.ERROR)) {
            const formatted: string = this.formatMessage(LOG_LEVEL.ERROR, message, this.context);
            if (data) {
                console.error(formatted, data);
            } else {
                console.error(formatted);
            }
        }
    }
}