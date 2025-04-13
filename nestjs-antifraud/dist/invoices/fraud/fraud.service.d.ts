import { PrismaService } from '../../prisma/prisma.service';
import { ProcessInvoiceFraudDto } from '../dto/process-invoice-fraud.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FraudAggregateSpecification } from './specifications/fraud-aggregate.specification';
export declare class FraudService {
    private prismaService;
    private fraudAggregateSpec;
    private eventEmitter;
    constructor(prismaService: PrismaService, fraudAggregateSpec: FraudAggregateSpecification, eventEmitter: EventEmitter2);
    processInvoice(processInvoiceFraudDto: ProcessInvoiceFraudDto): Promise<{
        invoice: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            accountId: string;
            amount: number;
            status: import(".prisma/client").$Enums.InvoiceStatus;
        };
        fraudResult: import("./specifications/fraud-specification.interface").FraudDetectionResult;
    }>;
}
