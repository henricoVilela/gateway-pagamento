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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const event_emitter_1 = require("@nestjs/event-emitter");
const fraud_aggregate_specification_1 = require("./specifications/fraud-aggregate.specification");
const invoice_processed_event_1 = require("../events/invoice-processed.event");
let FraudService = class FraudService {
    prismaService;
    fraudAggregateSpec;
    eventEmitter;
    constructor(prismaService, fraudAggregateSpec, eventEmitter) {
        this.prismaService = prismaService;
        this.fraudAggregateSpec = fraudAggregateSpec;
        this.eventEmitter = eventEmitter;
    }
    async processInvoice(processInvoiceFraudDto) {
        const { invoice_id, account_id, amount } = processInvoiceFraudDto;
        return this.prismaService.$transaction(async (prisma) => {
            const foundInvoice = await prisma.invoice.findUnique({
                where: {
                    id: invoice_id,
                },
            });
            if (foundInvoice) {
                throw new Error('Invoice has already been processed');
            }
            const account = await prisma.account.upsert({
                where: {
                    id: account_id,
                },
                update: {},
                create: {
                    id: account_id,
                },
            });
            const fraudResult = await this.fraudAggregateSpec.detectFraud({
                account,
                amount,
                invoiceId: invoice_id,
            });
            const invoice = await prisma.invoice.create({
                data: {
                    id: invoice_id,
                    accountId: account.id,
                    amount,
                    ...(fraudResult.hasFraud && {
                        fraudHistory: {
                            create: {
                                reason: fraudResult.reason,
                                description: fraudResult.description,
                            },
                        },
                    }),
                    status: fraudResult.hasFraud
                        ? client_1.InvoiceStatus.REJECTED
                        : client_1.InvoiceStatus.APPROVED,
                },
            });
            await this.eventEmitter.emitAsync('invoice.processed', new invoice_processed_event_1.InvoiceProcessedEvent(invoice, fraudResult));
            return {
                invoice,
                fraudResult,
            };
        });
    }
};
exports.FraudService = FraudService;
exports.FraudService = FraudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fraud_aggregate_specification_1.FraudAggregateSpecification,
        event_emitter_1.EventEmitter2])
], FraudService);
//# sourceMappingURL=fraud.service.js.map