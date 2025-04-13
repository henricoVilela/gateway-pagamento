"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfluentKafkaContext = void 0;
const microservices_1 = require("@nestjs/microservices");
class ConfluentKafkaContext extends microservices_1.BaseRpcContext {
    constructor(args) {
        super(args);
    }
    getMessage() {
        return this.getArgByIndex(0);
    }
    getPartition() {
        return this.getArgByIndex(1);
    }
    getTopic() {
        return this.getArgByIndex(2);
    }
    getConsumer() {
        return this.getArgByIndex(3);
    }
    getHeartbeat() {
        return this.getArgByIndex(4);
    }
    getProducer() {
        return this.getArgByIndex(5);
    }
}
exports.ConfluentKafkaContext = ConfluentKafkaContext;
//# sourceMappingURL=confluent-kafka-context.js.map