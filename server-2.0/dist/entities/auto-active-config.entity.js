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
exports.AutoActiveConfig = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
// Entities
let AutoActiveConfig = class AutoActiveConfig extends base_entity_1.BaseEntity {
    id;
    auto_active;
    auto_active_decrease_price;
    max_pnl_start;
    max_pnl_threshold_to_quit;
    percent_to_buy;
    percent_to_first_buy;
    percent_to_sell;
    pnl_to_stop;
    price_type;
    transaction_size_start;
};
exports.AutoActiveConfig = AutoActiveConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AutoActiveConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], AutoActiveConfig.prototype, "auto_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], AutoActiveConfig.prototype, "auto_active_decrease_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], AutoActiveConfig.prototype, "max_pnl_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], AutoActiveConfig.prototype, "max_pnl_threshold_to_quit", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], AutoActiveConfig.prototype, "percent_to_buy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], AutoActiveConfig.prototype, "percent_to_first_buy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], AutoActiveConfig.prototype, "percent_to_sell", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], AutoActiveConfig.prototype, "pnl_to_stop", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], AutoActiveConfig.prototype, "price_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], AutoActiveConfig.prototype, "transaction_size_start", void 0);
exports.AutoActiveConfig = AutoActiveConfig = __decorate([
    (0, typeorm_1.Entity)("auto_active_config")
], AutoActiveConfig);
