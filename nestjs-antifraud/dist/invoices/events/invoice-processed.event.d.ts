import { FraudReason, Invoice } from '@prisma/client';
export declare class InvoiceProcessedEvent {
    readonly invoice: Invoice;
    readonly fraudResult: {
        hasFraud: boolean;
        reason?: FraudReason;
        description?: string;
    };
    constructor(invoice: Invoice, fraudResult: {
        hasFraud: boolean;
        reason?: FraudReason;
        description?: string;
    });
}
