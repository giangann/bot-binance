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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const coin_service_1 = __importDefault(require("../services/coin.service"));
const binance_service_1 = __importDefault(require("../services/binance.service"));
const getNowClosePrices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currSymbols = yield coin_service_1.default.getAllSymbolsDB();
        const currPrices = yield binance_service_1.default.getSymbolsClosePrice(currSymbols);
        server_response_ultil_1.ServerResponse.response(res, currPrices);
    }
    catch (err) {
        console.log("err", err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
exports.default = { getNowClosePrices };