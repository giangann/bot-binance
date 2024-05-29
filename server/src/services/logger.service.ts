import { TNewOrder } from "../types/order";
import { logger } from "../loaders/logger.config";
import { errorToString } from "../ultils/error-handler.ultil";

function saveTickLog(
  created: number,
  success: number,
  fail: number,
  saved: number,
  time: number,
  chainId: number
) {
  const content = `CHAIN: ${chainId} || Đã tạo: ${created} | Thành công: ${success} | Thất bại: ${fail} | Đã lưu: ${saved} | Tổng thời gian: ${(
    time / 1000
  ).toFixed(2)}s`;
  logger.debug(content);
}

function saveOrderLog(
  orderInfo: Pick<TNewOrder, "orderId" | "symbol" | "origQty" | "side">,
  positionAmt: number | string,
  percentChange: number | string,
  prevPrice: number | string,
  currPrice: number | string,
  isFirstOrder: boolean,
  size: number | string
) {
  const { orderId, symbol, origQty, side } = orderInfo;
  const info = `OrderId: ${orderId}; Symbol: ${symbol}; Side:${side}; Qty: ${origQty}`;
  const reason = `isFirstOrder: ${isFirstOrder}, prevPrice: ${prevPrice}, currPrice: ${currPrice}, percentChange: ${percentChange}, positionAmt: ${positionAmt}, size:${size}`;

  logger.debug(`${info} ${reason}`);
}

// get string content from Error object and save to error.log file
function saveErrorLog(err: Error) {
  const content = errorToString(err);
  logger.error(content);
}

export default { saveOrderLog, saveTickLog, saveErrorLog };
