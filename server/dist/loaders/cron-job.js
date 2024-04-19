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
exports.cronJobSchedule = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const binance_service_1 = __importDefault(require("../services/binance.service"));
const coin_service_1 = __importDefault(require("../services/coin.service"));
const cronJobSchedule = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("cron job file");
    const task = node_cron_1.default.schedule("0 31 1 * * *", () => {
        console.log("task run");
        updateCoinTable();
    }, {
        scheduled: false,
        timezone: "Asia/Ho_Chi_Minh",
    });
    task.start();
});
exports.cronJobSchedule = cronJobSchedule;
function crawCoinPrices() {
    return __awaiter(this, void 0, void 0, function* () {
        const symbols = yield binance_service_1.default.getAllSymbol();
        const prices = yield binance_service_1.default.getSymbolsClosePrice(symbols);
        return prices;
    });
}
function updateCoinTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const coins = yield crawCoinPrices();
            const updatedCoins = yield Promise.all(coins.map((coin) => {
                let coinParams = Object.assign(Object.assign({}, coin), { price: coin.price.toString() });
                return coin_service_1.default.update(coinParams);
            }));
            return updatedCoins;
        }
        catch (err) {
            console.log(err);
        }
    });
}
