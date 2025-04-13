"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceProcessedEvent = void 0;
class InvoiceProcessedEvent {
    invoice;
    fraudResult;
    constructor(invoice, fraudResult) {
        this.invoice = invoice;
        this.fraudResult = fraudResult;
    }
}
exports.InvoiceProcessedEvent = InvoiceProcessedEvent;
//# sourceMappingURL=invoice-processed.event.js.map