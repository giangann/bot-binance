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
exports.UpdateMarketOrderChainsTableAddColsTotalBalanceStartTotalBalanceEndPercentChange1713079953826 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColsTotalBalanceStartTotalBalanceEndPercentChange1713079953826 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumns("market_order_chains", [
                new typeorm_1.TableColumn({
                    name: "total_balance_start",
                    type: "varchar",
                    isNullable: false,
                }),
                new typeorm_1.TableColumn({
                    name: "total_balance_end",
                    type: "varchar",
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: "percent_change",
                    type: "varchar",
                    isNullable: true,
                }),
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumns("market_order_chains", [
                "total_balance_start",
                "total_balance_end",
                "percent_change",
            ]);
        });
    }
}
exports.UpdateMarketOrderChainsTableAddColsTotalBalanceStartTotalBalanceEndPercentChange1713079953826 = UpdateMarketOrderChainsTableAddColsTotalBalanceStartTotalBalanceEndPercentChange1713079953826;
