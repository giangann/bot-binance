import { TSymbolPrice, TSymbolPriceMap } from "../types/symbol-price";
import binanceService from "../services/binance.service";
import coinService from "../services/coin.service";

export const getPriceOfSymbols = async () => {
  try {
    const symbols = await coinService.getAllSymbolsDB();
    const prices = await binanceService.getSymbolsClosePrice(symbols);
    global.symbolsPrice = arrayToMap(prices);

    console.log(
      "load price map to ram success, with first symbols is",
      global.symbolsPrice[Object.keys(global.symbolsPrice)[0]]
    );
  } catch (err) {
    console.log("err", err);
  }
};

function arrayToMap(arr: TSymbolPrice[]) {
  let map: TSymbolPriceMap = {};
  for (let el of arr) {
    let key = el.symbol;
    if (!(key in map)) {
      map[key] = el;
    }
  }
  return map;
}
