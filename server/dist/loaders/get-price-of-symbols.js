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
exports.arrayToMap = exports.getPriceOfSymbols = void 0;
const binance_service_1 = __importDefault(require("../services/binance.service"));
const coin_service_1 = __importDefault(require("../services/coin.service"));
const getPriceOfSymbols = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const symbols = yield coin_service_1.default.getAllSymbolsDB();
        const prices = yield binance_service_1.default.getSymbolsClosePrice(symbols);
        global.symbolsPriceMap = arrayToMap(prices);
        console.log("load price map to ram success, with first symbols is", global.symbolsPriceMap[Object.keys(global.symbolsPriceMap)[0]]);
    }
    catch (err) {
        console.log("err", err);
    }
});
exports.getPriceOfSymbols = getPriceOfSymbols;
function arrayToMap(arr) {
    let map = {};
    for (let el of arr) {
        let key = el.symbol;
        if (!(key in map)) {
            map[key] = el;
        }
    }
    return map;
}
exports.arrayToMap = arrayToMap;
