import IController from "IController";
import { TOrderChainStatus } from "market-order-chain.interface";
import { IMarketOrderPieceCreate } from "market-order-piece.interface";
import moment from "moment";
import binanceService from "../services/binance.service";
import marketOrderChainService from "../services/market-order-chain.service";
import marketOrderPieceService from "../services/market-order-piece.service";
import { compareDate, priceToPercent } from "../ultils/helper.ultil";
import { ServerResponse } from "../ultils/server-response.ultil";

const list: IController = async (req, res) => {
  try {
    const listChain = await marketOrderChainService.list();
    ServerResponse.response(res, listChain);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};
const create: IController = async (req, res) => {
  try {
    // create new record of order chain in db
    let params: TMOrderParams = {
      amount: parseFloat(req.body.amount),
      side: req.body.side,
      symbol: req.body.symbol,
    };
    let intervalTime = parseInt(req.body.interval_time);
    let percentDiff = {
      down: parseFloat(req.body.percent_diff_down),
      up: parseFloat(req.body.percent_diff_up),
    };
    let amountMulti = parseInt(req.body.amount_multi);

    const totalBalanceNow = (
      await binanceService.getMyBalance()
    ).total.toString();
    const newChain = await marketOrderChainService.create({
      status: "open",
      total_balance_start: totalBalanceNow,
    });

    let count = 0;

    const interval = setInterval(async () => {
      // check can excute
      let prev_total = count
        ? (await getLastOrder()).total_balance
        : newChain.total_balance_start;
      let percentChange = await totalBalancePercentChange(prev_total);
      const isExecute = await isContinue(prev_total, percentDiff.down);
      //
      if (isExecute) {
        try {
          if (percentChange > percentDiff.up) {
            params = { ...params, amount: params.amount * amountMulti }; //multi amount
          }
          // create binance order - call piece order
          const newBinanceOrder = await makeOrderAndNoti(params);
          // save this piece order with correspond order chain
          await saveOrderPiece(newBinanceOrder.id, newChain.id, percentChange);
          count += 1;
        } catch (err) {
          console.log("err", err);
          const total_balance_end = (await getLastOrder()).total_balance;
          const percent_change =
            parseFloat(total_balance_end) /
            parseFloat(newChain.total_balance_start);
          updateOrderChainStatus(
            newChain.id,
            "closed",
            total_balance_end,
            percent_change
          );
          clearInterval(interval);
        }
      } else {
        const total_balance_end = (await getLastOrder()).total_balance;
        const percent_change =
          parseFloat(total_balance_end) /
          parseFloat(newChain.total_balance_start);
        updateOrderChainStatus(
          newChain.id,
          "closed",
          total_balance_end,
          percent_change
        );
        clearInterval(interval);
      }
    }, intervalTime * 1000);

    ServerResponse.response(res, newChain);
  } catch (err) {
    ServerResponse.error(res, err.message);
    console.log("chain controller err", err);
  }
};

type TMOrderParams = {
  symbol: string;
  side: "buy" | "sell";
  amount: number;
};

type TOrderPieceParmas = {
  orderChainId: number;
  percentChange: number;
};

async function action(
  orderBinanceParams: TMOrderParams,
  orderPieceParams: TOrderPieceParmas
) {
  // make binance order as orderPiece and save to db
  const newBinanceOrder = await makeOrderAndNoti(orderBinanceParams);
  console.log(newBinanceOrder.id);

  // save order piece correspond with order chain
  const { orderChainId, percentChange } = orderPieceParams;
  const orderPiece = await saveOrderPiece(
    newBinanceOrder.id,
    orderChainId,
    percentChange
  );
}

async function makeOrderAndNoti(params: TMOrderParams) {
  //  make binance market order
  const { symbol, side, amount } = params;
  let newBinanceOrder = await binanceService.createMarketOrder(
    symbol,
    side,
    amount
  );

  //  ws noti here ...
  return newBinanceOrder;
}

async function saveOrderPiece(
  id: string,
  market_order_chains_id: number,
  percent_change: number
) {
  let total_balance = (await binanceService.getMyBalance()).total;
  // create new record of order piece to db
  let pieceParams: IMarketOrderPieceCreate = {
    id,
    market_order_chains_id,
    total_balance: total_balance.toString(),
    percent_change: percent_change.toString(),
  };
  const savedOrder = await marketOrderPieceService.create(pieceParams);

  return savedOrder;
}

async function updateOrderChainStatus(
  chainId: number,
  status: TOrderChainStatus,
  total_balance_end: string,
  percent_change: number
) {
  const updatedAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const updatedOrderChain = await marketOrderChainService.update({
    id: chainId,
    status: status,
    updatedAt,
    percent_change: percent_change.toString(),
    total_balance_end,
  });
  console.log("chain ", chainId, " closed");

  return updatedOrderChain;
}

// calculate percent_change prev_total with curr_total
// percent_change >=down then return true, else is false
async function isContinue(
  prev_total: number | string,
  down: number
): Promise<boolean> {
  const percent_change = await totalBalancePercentChange(prev_total);

  if (percent_change >= down) return true;
  return false;
}
async function totalBalancePercentChange(prev_total: string | number) {
  const curr_total = (await binanceService.getMyBalance()).total;
  return priceToPercent(
    typeof prev_total === "string" ? parseFloat(prev_total) : prev_total,
    curr_total
  );
}

async function getLastOrder() {
  const listOrder = await marketOrderPieceService.list();

  const sortedListOrder = listOrder.sort((a, b) =>
    compareDate(a.createdAt, b.createdAt)
  );

  return sortedListOrder[0];
}

export default { create, list };
