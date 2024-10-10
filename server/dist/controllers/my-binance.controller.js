"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const my_binance_service_1 = require("../services/my-binance.service");
const helper_1 = require("../ultils/helper");
const server_response_ultil_1 = require("../ultils/server-response.ultil");
// Initialize myBinanceService with your base URL
const myBinanceService = new my_binance_service_1.MyBinanceService();
// Controller for creating a market order
const createMarketOrder = async (req, res) => {
    try {
        const { symbol, side, quantity, arbitraryId } = req.body;
        // Call myBinanceService to create a market order
        const result = await myBinanceService.createMarketOrder(symbol, side, quantity, arbitraryId);
        // Respond with the result
        server_response_ultil_1.ServerResponse.response(res, result);
    }
    catch (error) {
        // Handle and log errors
        server_response_ultil_1.ServerResponse.error(res, error.message);
    }
};
const getAccInfo = async (req, res) => {
    try {
        const accInfo = await myBinanceService.getAccountInfo();
        server_response_ultil_1.ServerResponse.response(res, accInfo);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const getPosition = async (req, res) => {
    try {
        // get position from binance service
        const allPositions = await myBinanceService.getPositions();
        const positionsNotZero = (0, helper_1.filterPositionsNotZero)(allPositions);
        server_response_ultil_1.ServerResponse.response(res, positionsNotZero);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const closeAllLongPositions = async (req, res) => {
    try {
        const { success, failure } = await myBinanceService.closeAllPositions();
        server_response_ultil_1.ServerResponse.response(res, { success, failure });
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
exports.default = { createMarketOrder, getAccInfo, getPosition, closeAllLongPositions };
