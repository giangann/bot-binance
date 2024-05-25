"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_config_1 = require("../loaders/logger.config");
function saveTickLog(created, success, fail, saved, time, chainId) {
    const content = `CHAIN: ${chainId} || Đã tạo: ${created} | Thành công: ${success} | Thất bại: ${fail} | Đã lưu: ${saved} | Tổng thời gian: ${(time / 1000).toFixed(2)}s`;
    logger_config_1.logger.debug(content);
}
function saveOrderLog(orderInfo, positionAmt, percentChange, prevPrice, currPrice, isFirstOrder, size) {
    const { orderId, symbol, origQty, side } = orderInfo;
    const info = `OrderId: ${orderId}; Symbol: ${symbol}; Side:${side}; Qty: ${origQty}`;
    const reason = `isFirstOrder: ${isFirstOrder}, prevPrice: ${prevPrice}, currPrice: ${currPrice}, percentChange: ${percentChange}, positionAmt: ${positionAmt}, size:${size}`;
    logger_config_1.logger.debug(`${info} ${reason}`);
}
exports.default = { saveOrderLog, saveTickLog };
