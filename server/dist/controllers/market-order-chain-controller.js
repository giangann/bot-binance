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
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const log_service_1 = __importDefault(require("../services/log.service"));
const market_order_piece_service_1 = __importDefault(require("../services/market-order-piece.service"));
const logger_config_1 = require("../loaders/logger.config");
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listChain = yield market_order_chain_service_1.default.list();
        server_response_ultil_1.ServerResponse.response(res, listChain);
    }
    catch (err) {
        console.log("err", err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
const isBotActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const openChain = yield market_order_chain_service_1.default.list({ status: "open" });
        server_response_ultil_1.ServerResponse.response(res, openChain.length);
    }
    catch (err) {
        console.log("err", err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
const getLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const chainId = parseInt((_a = req.params) === null || _a === void 0 ? void 0 : _a.chainId);
        const logs = yield log_service_1.default.list({ market_order_chains_id: chainId });
        server_response_ultil_1.ServerResponse.response(res, logs);
    }
    catch (err) {
        console.log("err", err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
const testLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listChain = yield market_order_chain_service_1.default.list();
        const idOfChainToSave = listChain[listChain.length - 1].id;
        const testPiece = {
            market_order_chains_id: idOfChainToSave,
            amount: "0",
            direction: "SELL",
            id: "0",
            percent_change: "0",
            price: "0",
            symbol: "0",
            total_balance: "0",
            transaction_size: "0",
        };
        const createdPiece = yield market_order_piece_service_1.default.create(testPiece);
        logger_config_1.logger.debug("new test order created");
        server_response_ultil_1.ServerResponse.response(res, createdPiece);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
exports.default = { list, getLogs, isBotActive, testLogs };
