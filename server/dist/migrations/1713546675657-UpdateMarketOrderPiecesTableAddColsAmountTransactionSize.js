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
exports.UpdateMarketOrderPiecesTableAddColsAmountTransactionSize1713546675657 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderPiecesTableAddColsAmountTransactionSize1713546675657 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumns("market_order_pieces", [
                new typeorm_1.TableColumn({
                    name: "amount",
                    type: "varchar",
                    isNullable: false,
                }),
                new typeorm_1.TableColumn({
                    name: "transaction_size",
                    type: "varchar",
                    isNullable: false,
                }),
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumns("market_order_pieces", [
                "amount",
                "transaction_size",
            ]);
        });
    }
}
exports.UpdateMarketOrderPiecesTableAddColsAmountTransactionSize1713546675657 = UpdateMarketOrderPiecesTableAddColsAmountTransactionSize1713546675657;
