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
exports.MarketOrderChain = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const market_order_piece_entity_1 = require("./market-order-piece.entity");
// Entities
let MarketOrderChain = class MarketOrderChain extends base_entity_1.BaseEntity {
};
exports.MarketOrderChain = MarketOrderChain;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MarketOrderChain.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MarketOrderChain.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MarketOrderChain.prototype, "total_balance_start", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MarketOrderChain.prototype, "total_balance_end", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MarketOrderChain.prototype, "price_start", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MarketOrderChain.prototype, "price_end", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MarketOrderChain.prototype, "percent_change", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => market_order_piece_entity_1.MarketOrderPiece, (piece) => piece.order_chain),
    (0, typeorm_1.JoinColumn)({ name: "id", referencedColumnName: "market_order_chains_id" }),
    __metadata("design:type", Array)
], MarketOrderChain.prototype, "order_pieces", void 0);
exports.MarketOrderChain = MarketOrderChain = __decorate([
    (0, typeorm_1.Entity)("market_order_chains", { orderBy: { createdAt: "DESC" } })
], MarketOrderChain);
