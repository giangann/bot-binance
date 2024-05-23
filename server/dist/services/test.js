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
const logger_config_1 = require("../loaders/logger.config");
const coinService = new coin_service_1.default(true);
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    // // const symbol = "TOKENUSDT";
    // // const direction = "SELL";
    // // let amount = 20;
    // // const response = await binanceService.createMarketOrder(
    // //   symbol,
    // //   direction,
    // //   amount
    // // );
    // console.log("response", response);
    logger_config_1.logger.info('info level test');
    // logger.error('error level test')
    // logger.debug('debug level test')
});
test();
