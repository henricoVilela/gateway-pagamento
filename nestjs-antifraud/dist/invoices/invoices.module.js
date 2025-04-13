"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesModule = void 0;
const common_1 = require("@nestjs/common");
const fraud_service_1 = require("./fraud/fraud.service");
const frequent_high_value_specification_1 = require("./fraud/specifications/frequent-high-value.specification");
const suspicious_account_specification_1 = require("./fraud/specifications/suspicious-account.specification");
const unusual_amount_specification_1 = require("./fraud/specifications/unusual-amount.specification");
const fraud_aggregate_specification_1 = require("./fraud/specifications/fraud-aggregate.specification");
const invoices_service_1 = require("./invoices.service");
const invoices_controller_1 = require("./invoices.controller");
const invoices_consumer_1 = require("./invoices.consumer");
const kafkaLib = require("@confluentinc/kafka-javascript");
const publish_processed_invoice_listener_1 = require("./events/publish-processed-invoice.listener");
let InvoicesModule = class InvoicesModule {
};
exports.InvoicesModule = InvoicesModule;
exports.InvoicesModule = InvoicesModule = __decorate([
    (0, common_1.Module)({
        providers: [
            fraud_service_1.FraudService,
            frequent_high_value_specification_1.FrequentHighValueSpecification,
            suspicious_account_specification_1.SuspiciousAccountSpecification,
            unusual_amount_specification_1.UnusualAmountSpecification,
            fraud_aggregate_specification_1.FraudAggregateSpecification,
            {
                provide: 'FRAUD_SPECIFICATIONS',
                useFactory: (frequentHighValueSpec, suspiciousAccountSpec, unusualAmountSpec) => {
                    return [
                        frequentHighValueSpec,
                        suspiciousAccountSpec,
                        unusualAmountSpec,
                    ];
                },
                inject: [
                    frequent_high_value_specification_1.FrequentHighValueSpecification,
                    suspicious_account_specification_1.SuspiciousAccountSpecification,
                    unusual_amount_specification_1.UnusualAmountSpecification,
                ],
            },
            invoices_service_1.InvoicesService,
            {
                provide: kafkaLib.KafkaJS.Kafka,
                useValue: new kafkaLib.KafkaJS.Kafka({
                    'bootstrap.servers': 'kafka:9092',
                }),
            },
            publish_processed_invoice_listener_1.PublishProcessedInvoiceListener,
        ],
        controllers: [invoices_controller_1.InvoicesController, invoices_consumer_1.InvoicesConsumer],
    })
], InvoicesModule);
//# sourceMappingURL=invoices.module.js.map