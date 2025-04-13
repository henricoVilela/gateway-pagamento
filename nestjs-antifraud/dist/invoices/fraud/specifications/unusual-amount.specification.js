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
exports.UnusualAmountSpecification = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let UnusualAmountSpecification = class UnusualAmountSpecification {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async detectFraud(context) {
        const { account, amount } = context;
        const suspiciousVariationPercentage = this.configService.getOrThrow('SUSPICIOUS_VARIATION_PERCENTAGE');
        const invoicesHistoryCount = this.configService.getOrThrow('INVOICES_HISTORY_COUNT');
        const previousInvoices = await this.prisma.invoice.findMany({
            where: { accountId: account.id },
            orderBy: { createdAt: 'desc' },
            take: invoicesHistoryCount,
        });
        if (previousInvoices.length > 0) {
            const totalAmount = previousInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
            const averageAmount = totalAmount / previousInvoices.length;
            if (amount > averageAmount * (1 + suspiciousVariationPercentage / 100)) {
                return {
                    hasFraud: true,
                    reason: client_1.FraudReason.UNUSUAL_PATTERN,
                    description: `Amount ${amount} is ${((amount / averageAmount) * 100 - 100).toFixed(2)}% higher than account average of ${averageAmount.toFixed(2)}`,
                };
            }
        }
        return { hasFraud: false };
    }
};
exports.UnusualAmountSpecification = UnusualAmountSpecification;
exports.UnusualAmountSpecification = UnusualAmountSpecification = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], UnusualAmountSpecification);
//# sourceMappingURL=unusual-amount.specification.js.map