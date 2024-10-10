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
exports.MarketOrderChainTest = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const dataset_entity_1 = require("./dataset.entity");
const market_order_piece_test_entity_1 = require("./market-order-piece-test.entity");
// Entities
let MarketOrderChainTest = class MarketOrderChainTest extends base_entity_1.BaseEntity {
    id;
    status;
    total_balance_start;
    transaction_size_start;
    percent_to_first_buy;
    percent_to_buy;
    percent_to_sell;
    total_balance_end;
    price_start;
    price_end;
    percent_change;
    pnl_to_stop;
    is_over_pnl_to_stop;
    stop_reason;
    max_pnl_start;
    max_pnl_threshold_to_quit;
    symbol_max_pnl_start;
    symbol_max_pnl_threshold;
    symbol_pnl_to_cutloss;
    is_max_pnl_start_reached;
    price_type;
    start_reason;
    datasets_id;
    dataset;
    order_pieces_test;
};
exports.MarketOrderChainTest = MarketOrderChainTest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MarketOrderChainTest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "total_balance_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], MarketOrderChainTest.prototype, "transaction_size_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "percent_to_first_buy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "percent_to_buy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "percent_to_sell", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "total_balance_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "price_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "price_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "percent_change", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "pnl_to_stop", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], MarketOrderChainTest.prototype, "is_over_pnl_to_stop", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "stop_reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "max_pnl_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "max_pnl_threshold_to_quit", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "symbol_max_pnl_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "symbol_max_pnl_threshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "symbol_pnl_to_cutloss", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: false }),
    __metadata("design:type", Boolean)
], MarketOrderChainTest.prototype, "is_max_pnl_start_reached", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "price_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketOrderChainTest.prototype, "start_reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], MarketOrderChainTest.prototype, "datasets_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dataset_entity_1.Dataset, (dtSet) => dtSet.order_chains_test),
    (0, typeorm_1.JoinColumn)({ name: "datasets_id", referencedColumnName: "id" }),
    __metadata("design:type", dataset_entity_1.Dataset)
], MarketOrderChainTest.prototype, "dataset", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => market_order_piece_test_entity_1.MarketOrderPieceTest, (piece) => piece.order_chain_test),
    (0, typeorm_1.JoinColumn)({ name: "id", referencedColumnName: "market_order_chains_test_id" }),
    __metadata("design:type", Array)
], MarketOrderChainTest.prototype, "order_pieces_test", void 0);
exports.MarketOrderChainTest = MarketOrderChainTest = __decorate([
    (0, typeorm_1.Entity)("market_order_chains_test", { orderBy: { createdAt: "DESC" } })
], MarketOrderChainTest);
