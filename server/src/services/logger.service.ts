import { TNewOrder, TOrderInfo } from "../types/order";
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

// orderInfo: TOrderInfo = TOrderParams & TOrderReason & TOrderMoreInfo
// newOrder: response.data: TNewOrder when make new order
function saveOrderLog(mergedOrder: TOrderInfo & TNewOrder, chainId: number) {
  const {
    orderId,
    symbol,
    side,
    origQty,
    currPrice,
    prevPrice,
    percentChange,
    amount,
    positionAmt,
    isFirstOrder,
  } = mergedOrder;

  // example: CHAIN_ID: 137 ORDER_ID: 123456 || BUY 0.05 BTCUSDT
  const info = `CHAIN_ID: ${chainId} ORDER_ID: ${orderId} || ${side} ${origQty} ${symbol}`;
  const reason = `IS_FIRST_ORDER: ${isFirstOrder}, PREV_PRICE: ${prevPrice}, CURR_PRICE: ${currPrice}, PERCENT_CHANGE: ${percentChange}, POSITION_AMT: ${positionAmt}, AMOUNT: ${amount}`;

  logger.debug(`${info} ${reason}`);
}

// get string content from Error object and save to error.log file
function saveErrorLog(err: any) {
  if (err instanceof Error) {
    const content = errorToString(err);
    logger.error(content);
  } else {
    const errorKeys = Object.keys(err);
    const errorProperties = Object.getOwnPropertyNames(err);
    const content = `Uncommon Error Exception with Keys: ${errorKeys} --and-- Properties: ${errorProperties}`;
    logger.error(content);
  }
}

export default { saveOrderLog, saveTickLog, saveErrorLog };
