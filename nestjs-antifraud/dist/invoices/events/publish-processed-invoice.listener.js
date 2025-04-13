"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PublishProcessedInvoiceListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishProcessedInvoiceListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const invoice_processed_event_1 = require("./invoice-processed.event");
const kafkaLib = require("@confluentinc/kafka-javascript");
let PublishProcessedInvoiceListener = PublishProcessedInvoiceListener_1 = class PublishProcessedInvoiceListener {
    kafkaInst;
    logger = new common_1.Logger(PublishProcessedInvoiceListener_1.name);
    kafkaProducer;
    constructor(kafkaInst) {
        this.kafkaInst = kafkaInst;
    }
    async onModuleInit() {
        this.kafkaProducer = this.kafkaInst.producer();
        await this.kafkaProducer.connect();
    }
    async handle(event) {
        await this.kafkaProducer.send({
            topic: 'transactions_result',
            messages: [
                {
                    value: JSON.stringify({
                        invoice_id: event.invoice.id,
                        status: event.fraudResult.hasFraud ? 'rejected' : 'approved',
                    }),
                },
            ],
        });
        this.logger.log(`Invoice ${event.invoice.id} processed event published.`);
    }
};
exports.PublishProcessedInvoiceListener = PublishProcessedInvoiceListener;
__decorate([
    (0, event_emitter_1.OnEvent)('invoice.processed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_processed_event_1.InvoiceProcessedEvent]),
    __metadata("design:returntype", Promise)
], PublishProcessedInvoiceListener.prototype, "handle", null);
exports.PublishProcessedInvoiceListener = PublishProcessedInvoiceListener = PublishProcessedInvoiceListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [kafkaLib.KafkaJS.Kafka])
], PublishProcessedInvoiceListener);
//# sourceMappingURL=publish-processed-invoice.listener.js.map