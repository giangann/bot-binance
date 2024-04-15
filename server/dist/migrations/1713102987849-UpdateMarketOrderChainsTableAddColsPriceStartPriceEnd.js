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
exports.UpdateMarketOrderChainsTableAddColsPriceStartPriceEnd1713102987849 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColsPriceStartPriceEnd1713102987849 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumns("market_order_chains", [
                new typeorm_1.TableColumn({
                    name: "price_start",
                    type: "varchar",
                    isNullable: false,
                }),
                new typeorm_1.TableColumn({
                    name: "price_end",
                    type: "varchar",
                    isNullable: true,
                }),
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumns("market_order_chains", [
                "price_start",
                "price_end",
            ]);
        });
    }
}
exports.UpdateMarketOrderChainsTableAddColsPriceStartPriceEnd1713102987849 = UpdateMarketOrderChainsTableAddColsPriceStartPriceEnd1713102987849;
