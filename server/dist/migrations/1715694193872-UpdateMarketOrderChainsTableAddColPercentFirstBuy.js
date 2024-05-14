"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColPercentFirstBuy1715694193872 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColPercentFirstBuy1715694193872 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn("market_order_chains", new typeorm_1.TableColumn({
                name: "percent_to_first_buy",
                type: "varchar",
                isNullable: false,
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn("market_order_chains", "percent_to_first_buy");
        });
    }
}
exports.UpdateMarketOrderChainsTableAddColPercentFirstBuy1715694193872 = UpdateMarketOrderChainsTableAddColPercentFirstBuy1715694193872;
