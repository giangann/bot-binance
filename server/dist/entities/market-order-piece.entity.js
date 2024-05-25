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
exports.MarketOrderPiece = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const market_order_chain_entity_1 = require("./market-order-chain.entity");
// Entities
let MarketOrderPiece = class MarketOrderPiece extends base_entity_1.BaseEntity {
    id;
    total_balance;
    percent_change;
    symbol;
    direction;
    price;
    amount;
    transaction_size;
    timestamp;
    market_order_chains_id;
    order_chain;
};
exports.MarketOrderPiece = MarketOrderPiece;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], MarketOrderPiece.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderPiece.prototype, "total_balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderPiece.prototype, "percent_change", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderPiece.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderPiece.prototype, "direction", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderPiece.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderPiece.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderPiece.prototype, "transaction_size", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketOrderPiece.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], MarketOrderPiece.prototype, "market_order_chains_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => market_order_chain_entity_1.MarketOrderChain, (chain) => chain.order_pieces),
    (0, typeorm_1.JoinColumn)({ name: "market_order_chains_id", referencedColumnName: "id" }),
    __metadata("design:type", market_order_chain_entity_1.MarketOrderChain)
], MarketOrderPiece.prototype, "order_chain", void 0);
exports.MarketOrderPiece = MarketOrderPiece = __decorate([
    (0, typeorm_1.Entity)("market_order_pieces", { orderBy: { createdAt: "DESC" } })
], MarketOrderPiece);
