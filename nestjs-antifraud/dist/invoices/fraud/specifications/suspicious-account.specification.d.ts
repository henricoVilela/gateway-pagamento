import { IFraudSpecification, FraudSpecificationContext, FraudDetectionResult } from './fraud-specification.interface';
export declare class SuspiciousAccountSpecification implements IFraudSpecification {
    detectFraud(context: FraudSpecificationContext): FraudDetectionResult;
}
