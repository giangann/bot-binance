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
const coin_service_1 = __importDefault(require("./coin.service"));
const bot_service_1 = __importDefault(require("./bot.service"));
const coinService = new coin_service_1.default(true);
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    const symbol = "BTCUSDT";
    const direction = "SELL";
    let amount = 0.05;
    yield bot_service_1.default.createOrder(112, symbol, direction, amount);
});
// test();
