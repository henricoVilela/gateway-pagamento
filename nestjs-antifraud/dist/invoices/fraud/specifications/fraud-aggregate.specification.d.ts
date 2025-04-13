import { FraudDetectionResult, FraudSpecificationContext, IFraudSpecification } from './fraud-specification.interface';
export declare class FraudAggregateSpecification implements IFraudSpecification {
    private specifications;
    constructor(specifications: IFraudSpecification[]);
    detectFraud(context: FraudSpecificationContext): Promise<FraudDetectionResult>;
}
