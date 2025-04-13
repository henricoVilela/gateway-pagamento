import { FraudService } from './fraud/fraud.service';
export type PendingInvoicesMessage = {
    account_id: string;
    amount: number;
    invoice_id: string;
};
export declare class InvoicesConsumer {
    private fraudService;
    private logger;
    constructor(fraudService: FraudService);
    handlePendingInvoices(message: PendingInvoicesMessage): Promise<void>;
}
