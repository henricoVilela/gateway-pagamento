import { OnModuleInit } from '@nestjs/common';
import { InvoiceProcessedEvent } from './invoice-processed.event';
import * as kafkaLib from '@confluentinc/kafka-javascript';
export declare class PublishProcessedInvoiceListener implements OnModuleInit {
    private kafkaInst;
    private logger;
    private kafkaProducer;
    constructor(kafkaInst: kafkaLib.KafkaJS.Kafka);
    onModuleInit(): Promise<void>;
    handle(event: InvoiceProcessedEvent): Promise<void>;
}
