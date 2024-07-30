"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const auto_active_config_service_1 = __importDefault(require("../services/auto-active-config.service"));
const helper_1 = require("../ultils/helper");
const getOne = async (req, res) => {
    try {
        const configData = await auto_active_config_service_1.default.getOne();
        server_response_ultil_1.ServerResponse.response(res, configData);
    }
    catch (error) {
        server_response_ultil_1.ServerResponse.error(res, error.message);
    }
};
const updateOne = async (req, res) => {
    try {
        const params = {
            auto_active_decrease_price: req.body?.auto_active_decrease_price,
            max_pnl_start: req.body?.max_pnl_start,
            max_pnl_threshold_to_quit: req.body?.max_pnl_threshold_to_quit,
            percent_to_buy: req.body?.percent_to_buy,
            percent_to_first_buy: req.body?.percent_to_first_buy,
            percent_to_sell: req.body?.percent_to_sell,
            pnl_to_stop: req.body?.pnl_to_stop,
            price_type: req.body?.price_type,
            transaction_size_start: req.body?.transaction_size_start,
        };
        const validParams = (0, helper_1.removeNullUndefinedProperties)(params);
        const updatedRecord = await auto_active_config_service_1.default.updateOne(validParams);
        server_response_ultil_1.ServerResponse.response(res, updatedRecord);
    }
    catch (error) {
        server_response_ultil_1.ServerResponse.error(res, error.message);
    }
};
exports.default = { getOne, updateOne };
