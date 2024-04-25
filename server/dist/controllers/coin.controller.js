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
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const getNowClosePrices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const currSymbols = await coinService.getAllSymbolsDB();
        // const currPrices = await binanceService.getSymbolsClosePrice(currSymbols);
        // ServerResponse.response(res, currPrices);
    }
    catch (err) {
        console.log("err", err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
exports.default = { getNowClosePrices };
