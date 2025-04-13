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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InvoicesConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesConsumer = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const fraud_service_1 = require("./fraud/fraud.service");
let InvoicesConsumer = InvoicesConsumer_1 = class InvoicesConsumer {
    fraudService;
    logger = new common_1.Logger(InvoicesConsumer_1.name);
    constructor(fraudService) {
        this.fraudService = fraudService;
    }
    async handlePendingInvoices(message) {
        this.logger.log(`Processing invoice: ${message.invoice_id}`);
        await this.fraudService.processInvoice({
            account_id: message.account_id,
            amount: message.amount,
            invoice_id: message.invoice_id,
        });
        this.logger.log(`Invoice processed: ${message.invoice_id}`);
    }
};
exports.InvoicesConsumer = InvoicesConsumer;
__decorate([
    (0, microservices_1.EventPattern)('pending_transactions'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoicesConsumer.prototype, "handlePendingInvoices", null);
exports.InvoicesConsumer = InvoicesConsumer = InvoicesConsumer_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [fraud_service_1.FraudService])
], InvoicesConsumer);
//# sourceMappingURL=invoices.consumer.js.map