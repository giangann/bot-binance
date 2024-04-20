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
exports.CreateLogTable1713592768233 = void 0;
const typeorm_1 = require("typeorm");
class CreateLogTable1713592768233 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "logs",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isGenerated: true,
                        generationStrategy: "increment",
                        isPrimary: true,
                    },
                    {
                        name: "market_order_chains_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "message",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "type",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "createdAt",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updatedAt",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }));
            yield queryRunner.createForeignKey("logs", new typeorm_1.TableForeignKey({
                columnNames: ["market_order_chains_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "market_order_chains",
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable("logs");
        });
    }
}
exports.CreateLogTable1713592768233 = CreateLogTable1713592768233;
