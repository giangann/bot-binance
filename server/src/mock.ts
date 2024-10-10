import { data1, data2, data3, data4 } from "./price-data";
import { TOpeningChain, TPosition } from "./type";

export const mock = [
  {
    tick: 1,
    data: data1,
  },
  {
    tick: 2,
    data: data2,
  },
  {
    tick: 3,
    data: data3,
  },
  {
    tick: 4,
    data: data4,
  },
];

export const positions0: TPosition[] = [
  // {
  //   symbol: "BTCUSDT",
  //   positionAmt: "0",
  //   unrealizedPnl: "0",
  // },
  // {
  //   symbol: "XRPUSDT",
  //   positionAmt: "0",
  //   unrealizedPnl: "0",
  // },
  // {
  //   symbol: "ETHUSDT",
  //   positionAmt: "0",
  //   unrealizedPnl: "0",
  // },
];

export const openingChain: TOpeningChain = {
  percent_to_buy: "5",
  percent_to_first_buy: "1",
  percent_to_sell: "-2.5",
  transaction_size_start: "10",
  pnl_to_stop: "-5",
};

export const openingChainTest: TOpeningChain & { datasets_id: number } = {
  percent_to_buy: "5",
  percent_to_first_buy: "1",
  percent_to_sell: "-2.5",
  transaction_size_start: "10",
  pnl_to_stop: "-5",
  datasets_id: 18,
};
// export const ableSymbols: string[] = ["BTCUSDT", "BCHUSDT", "ETHUSDT"];
export const LIMIT_SYMBOLS: string[] = ["BTCUSDT", "ETHUSDT"];

export const getMockPrices = (() => {
  let index = 0;

  const resetIndex = () => {
    index = 0;
  };

  const getPrices = () => {
    const prices = mock[index]?.data;
    index++;
    return prices;
  };

  return {
    getPrices,
    resetIndex,
  };
})();
