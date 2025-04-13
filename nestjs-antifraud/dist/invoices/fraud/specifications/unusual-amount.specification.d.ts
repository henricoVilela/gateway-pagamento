import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { IFraudSpecification, FraudSpecificationContext, FraudDetectionResult } from './fraud-specification.interface';
export declare class UnusualAmountSpecification implements IFraudSpecification {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    detectFraud(context: FraudSpecificationContext): Promise<FraudDetectionResult>;
}
