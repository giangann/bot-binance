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
exports.DatasetItem = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const dataset_entity_1 = require("./dataset.entity");
// Entities
let DatasetItem = class DatasetItem extends base_entity_1.BaseEntity {
    id;
    symbol;
    ticker_price;
    market_price;
    order;
    datasets_id;
    dataset;
};
exports.DatasetItem = DatasetItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DatasetItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], DatasetItem.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DatasetItem.prototype, "ticker_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DatasetItem.prototype, "market_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], DatasetItem.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], DatasetItem.prototype, "datasets_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dataset_entity_1.Dataset, (chain) => chain.dataset_items),
    (0, typeorm_1.JoinColumn)({ name: "datasets_id", referencedColumnName: "id" }),
    __metadata("design:type", dataset_entity_1.Dataset)
], DatasetItem.prototype, "dataset", void 0);
exports.DatasetItem = DatasetItem = __decorate([
    (0, typeorm_1.Entity)("dataset_items", { orderBy: { order: "ASC" } })
], DatasetItem);
