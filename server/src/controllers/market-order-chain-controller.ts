import IController from "IController";
import { TOrderChainStatus } from "market-order-chain.interface";
import { IMarketOrderPieceCreate } from "market-order-piece.interface";
import moment from "moment";
import binanceService from "../services/binance.service";
import marketOrderChainService from "../services/market-order-chain.service";
import marketOrderPieceService from "../services/market-order-piece.service";
import { ServerResponse } from "../ultils/server-response.ultil";

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

    const newChain = await marketOrderChainService.create({ status: "open" });

    // first run 1 marketOrder
    await action(params, newChain.id);

    const interval = setInterval(async () => {
      const isExecute = await isContinue(percentDiff.down);
      if (isExecute) {
        try {
          // make binance order as orderPiece and save to db
          if ((await totalBalancePercentChange()) >= percentDiff.up) {
            params = { ...params, amount: params.amount * amountMulti };
          }
          await action(params, newChain.id);
        } catch (err) {
          console.log("err", err);
          updateOrderChainStatus(newChain.id, "closed");
          clearInterval(interval);
        }
      } else {
        updateOrderChainStatus(newChain.id, "closed");
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

async function action(orderBinanceParams: TMOrderParams, orderChainId: number) {
  // one time from start
  const newBinanceOrder = await makeOrderAndNoti(orderBinanceParams);
  console.log(newBinanceOrder.id);

  // save order piece correspond with order chain
  const orderPiece = await saveOrderPiece(newBinanceOrder.id, orderChainId);
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

async function saveOrderPiece(id: string, market_order_chains_id: number) {
  let total_balance = (await binanceService.getMyBalance()).total;
  // create new record of order piece to db
  let pieceParams: IMarketOrderPieceCreate = {
    id,
    market_order_chains_id,
    total_balance: total_balance.toString(),
  };
  const savedOrder = await marketOrderPieceService.create(pieceParams);

  return savedOrder;
}

async function updateOrderChainStatus(
  chainId: number,
  status: TOrderChainStatus
) {
  const updatedAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const updatedOrderChain = await marketOrderChainService.update({
    id: chainId,
    status: status,
    updatedAt,
  });
  console.log("chain ", chainId, " closed");

  return updatedOrderChain;
}

async function isContinue(down: number): Promise<boolean> {
  const currTotalBalance = (await binanceService.getMyBalance()).total;
  const lastestTotalBalance = (await getLastOrder()).total_balance;
  const diff = await totalBalancePercentChange();

  // log
  console.log(
    "time now, now, last, diff",
    Date.now(),
    currTotalBalance,
    lastestTotalBalance,
    diff
  );
  //
  if (diff >= down) return true;
  return false;
}
async function totalBalancePercentChange() {
  const currTotalBalance = (await binanceService.getMyBalance()).total;
  const lastestTotalBalance = (await getLastOrder()).total_balance;

  return priceToPercent(currTotalBalance, parseFloat(lastestTotalBalance));
}

function priceToPercent(p1: number, p2: number) {
  if (p1 < p2) return (p2 / p1 - 1) * 100;
  else return -(p1 / p2 - 1) * 100;
}

async function getLastOrder() {
  const listOrder = await marketOrderPieceService.list();

  const sortedListOrder = listOrder.sort((a, b) =>
    compareDate(a.createdAt, b.createdAt)
  );

  return sortedListOrder[0];
}

function compareDate(date1: string, date2: string) {
  if (date1 >= date2) return -1;
  else return 1;
}
export default { create };
