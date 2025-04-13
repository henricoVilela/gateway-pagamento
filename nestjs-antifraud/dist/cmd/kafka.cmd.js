"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const confluent_kafka_server_1 = require("../kafka/confluent-kafka-server");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        strategy: new confluent_kafka_server_1.ConfluentKafkaServer({
            server: {
                'bootstrap.servers': 'kafka:29092',
            },
            consumer: {
                allowAutoTopicCreation: true,
                sessionTimeout: 10000,
                rebalanceTimeout: 10000,
            },
        }),
    });
    console.log('Kafka microservice is running');
    await app.listen();
}
void bootstrap();
//# sourceMappingURL=kafka.cmd.js.map