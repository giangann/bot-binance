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
exports.Dataset = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const dataset_item_entity_1 = require("./dataset-item.entity");
const market_order_chain_test_entity_1 = require("./market-order-chain-test.entity");
let Dataset = class Dataset extends base_entity_1.BaseEntity {
    id;
    name;
    /**
     * Sets cascades options for the given relation.
     * If set to true then it means that related object can be allowed to be inserted or updated in the database.
     * You can separately restrict cascades to insertion or updation using following syntax:
     *
     * cascade: ["insert", "update", "remove", "soft-remove", "recover"] // include or exclude one of them
     */
    dataset_items;
    order_chains_test;
};
exports.Dataset = Dataset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Dataset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Dataset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dataset_item_entity_1.DatasetItem, (item) => item.dataset, { cascade: ["insert", "update", "remove"] }),
    (0, typeorm_1.JoinColumn)({ name: "id", referencedColumnName: "datasets_id" }),
    __metadata("design:type", Array)
], Dataset.prototype, "dataset_items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => market_order_chain_test_entity_1.MarketOrderChainTest, (item) => item.dataset, { cascade: ["insert", "update", "remove"] }),
    (0, typeorm_1.JoinColumn)({ name: "id", referencedColumnName: "datasets_id" }),
    __metadata("design:type", Array)
], Dataset.prototype, "order_chains_test", void 0);
exports.Dataset = Dataset = __decorate([
    (0, typeorm_1.Entity)("datasets", { orderBy: { createdAt: "DESC" } })
], Dataset);
