import { BaseRpcContext } from '@nestjs/microservices';
import * as kafkaLib from '@confluentinc/kafka-javascript';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
type ConfluentKafkaContextArgs = [
    message: KafkaMessage,
    partition: number,
    topic: string,
    consumer: kafkaLib.KafkaJS.Consumer,
    heartbeat: () => Promise<void>,
    producer: kafkaLib.KafkaJS.Producer
];
export declare class ConfluentKafkaContext extends BaseRpcContext<ConfluentKafkaContextArgs> {
    constructor(args: ConfluentKafkaContextArgs);
    getMessage(): KafkaMessage;
    getPartition(): number;
    getTopic(): string;
    getConsumer(): kafkaLib.KafkaJS.Consumer;
    getHeartbeat(): () => Promise<void>;
    getProducer(): kafkaLib.KafkaJS.Producer;
}
export {};
