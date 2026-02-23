import {PurchaseStep} from "../../models/PurchaseStep";
import {ValidationDTO} from "../../models/ValidationDTO";

export class ValidationService {

    public async validate(input: string, step: PurchaseStep): Promise<ValidationDTO> {
        switch (step) {
            case PurchaseStep.NAME:
                return await this.validateName(input);
            case PurchaseStep.PRICE:
                return await this.validatePrice(input);
            case PurchaseStep.DATE:
                return this.validateDate(input);
        }
        return { valid: false, error: "Validation error" }
    }

    async validateName(name: string): Promise<ValidationDTO> {
        if (!name || name.trim().length === 0) {
            return { valid: false, error: "The name cannot be empty" };
        }

        if (name.length > 100) {
            return { valid: false, error: "The name is too long (max 100 characters)" };
        }

        if (/[<>{}[\]]/.test(name)) {
            return { valid: false, error: "The name contains prohibited characters" };
        }

        return { valid: true, value: { name: name }};
    }

    async validatePrice(price: string): Promise<ValidationDTO> {
        if (!price || price.trim().length === 0) {
            return { valid: false, error: "The price cannot be empty" };
        }

        const normalizedPrice = price.replace(',', '.');

        const priceNum = parseFloat(normalizedPrice);
        if (isNaN(priceNum)) {
            return { valid: false, error: "The price must be a number" };
        }

        if (priceNum <= 0) {
            return { valid: false, error: "The price must be greater then 0" };
        }

        if (priceNum > 1000000000) {
            return { valid: false, error: "The price is too high" };
        }

        const roundedPrice = Math.round(priceNum * 100) / 100;

        return { valid: true, value: { price: roundedPrice }};
    }

    async validateDate(dateStr: string): Promise<ValidationDTO> {
        if (!dateStr || dateStr.trim().length === 0) {
            return { valid: false, error: "The date cannot be empty" };
        }

        if (dateStr.toLowerCase() === 'today') {
            return { valid: true, value: { date: new Date() } };
        }

        if (dateStr.toLowerCase() === 'yesterday') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return { valid: true, value: { date: yesterday } };
        }

        const formats: RegExp[] = [
            /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, // 31.12.2024
            /^(\d{1,2})\.(\d{1,2})\.(\d{2})$/, // 31.12.24
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // 31/12/2024
            /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // 31-12-2024
            /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // 2024-12-31
        ];

        for (const format of formats) {
            const match = dateStr.match(format);
            if (match) {
                let day, month, year;

                if (format === formats[4]) {
                    year = parseInt(match[1]);
                    month = parseInt(match[2]) - 1;
                    day = parseInt(match[3]);
                } else {
                    day = parseInt(match[1]);
                    month = parseInt(match[2]) - 1;
                    year = parseInt(match[3]);

                    if (year < 100) {
                        year += 2000;
                    }
                }

                const date = new Date(year, month, day);

                if (
                    date.getFullYear() === year &&
                    date.getMonth() === month &&
                    date.getDate() === day
                ) {
                    if (date > new Date()) {
                        return { valid: false, error: "The date cannot be in future" };
                    }

                    const minDate = new Date();
                    minDate.setFullYear(minDate.getFullYear() - 10);
                    if (date < minDate) {
                        return { valid: false, error: "The date is too old" };
                    }

                    return { valid: true, value: { date: date } };
                }
            }
        }
        return { valid: false, error: "Incorrect date format. Choose dd.mm.yyyy" };
    }
}