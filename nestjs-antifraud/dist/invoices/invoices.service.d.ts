import { PrismaService } from '../prisma/prisma.service';
export declare class InvoicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filter?: {
        withFraud?: boolean;
        accountId?: string;
    }): Promise<({
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
