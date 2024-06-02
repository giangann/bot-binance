import { TNewOrder, TOrderInfo } from "../types/order";
import { logger } from "../loaders/logger.config";
import { errorToString } from "../ultils/error-handler.ultil";
import moment from "moment";

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

// 2. use padStart and padEnd js string method.
//   chainId: 3
//   orderId: 12
//   Buy or Sell: 4
//   quantity: 5
//   symbol: 20
//   isFirstOrder: 5 (true:4, false:5)
//   prevPrice: 10 (to fixed 6)
//   currPrice: 10 (to fixed 6)
//   percentChange: 8 (toFixed 2)
//   positionAmt: 7
//   amount: 10 (toFixed 3)
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
    quantityPrecision,
  } = mergedOrder;

  // example: CHAIN_ID: 137 ORDER_ID: 123456 || BUY 0.05 BTCUSDT
  const timeStamp = moment().format("YYYY-MM-DD HH:mm:ss");
  const positionAmtValid = isNaN(positionAmt) ? 0 : positionAmt;

  const chainIdPad = chainId.toString().padEnd(3);
  const orderIdPad = orderId.toString().padEnd(12);
  const sidePad = side.padEnd(4);
  const origQtyPad = origQty.padEnd(5);
  const symbolPad = symbol.padEnd(20);
  const isFirstOrderPad = String(isFirstOrder).padEnd(5);
  const prevPricePad = prevPrice.toFixed(5).padEnd(12);
  const currPricePad = currPrice.toFixed(5).padEnd(12);
  const percentChangePad = `${percentChange.toFixed(2)}%`.padEnd(8);
  const positionAmtPad = positionAmtValid.toString().padEnd(7);
  const amountPad = amount.toFixed(3).padEnd(10);
  const quantityPrecisionPad = quantityPrecision.toString().padEnd(2);
  const timeStampPad = timeStamp;
  // const info = `CHAIN_ID: ${chainId} ORDER_ID: ${orderId} || ${side} ${origQty} ${symbol}`;
  // const reason = `IS_FIRST_ORDER: ${isFirstOrder}, PREV_PRICE: ${prevPrice}, CURR_PRICE: ${currPrice}, PERCENT_CHANGE: ${percentChange}, POSITION_AMT: ${positionAmt}, AMOUNT: ${amount}`;

  const info = `CHAIN_ID: ${chainIdPad} ORDER_ID: ${orderIdPad} || ${sidePad} ${origQtyPad} ${symbolPad}`;
  const reason = `IS_FIRST_ORDER: ${isFirstOrderPad}, PREV_PRICE: ${prevPricePad}, CURR_PRICE: ${currPricePad}, PERCENT_CHANGE: ${percentChangePad}, POSITION_AMT: ${positionAmtPad}, AMOUNT: ${amountPad}, QUANTITY_PRECISION: ${quantityPrecisionPad}, TIMESTAMP: ${timeStampPad}`;

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
