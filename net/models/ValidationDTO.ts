export interface ValidationDTO {
    valid: boolean;
    value?: {
        name?: string;
        price?: number;
        date?: Date;
    }
    error?: string
}