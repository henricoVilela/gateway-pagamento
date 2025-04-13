import { FindAllInvoiceDto } from './dto/find-all-invoice.dto';
import { InvoicesService } from './invoices.service';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    findAll(filter: FindAllInvoiceDto): Promise<({
        account: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isSuspicious: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        amount: number;
        status: import(".prisma/client").$Enums.InvoiceStatus;
    })[]>;
    findOne(id: string): Promise<({
        account: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isSuspicious: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        amount: number;
        status: import(".prisma/client").$Enums.InvoiceStatus;
    }) | null>;
}
