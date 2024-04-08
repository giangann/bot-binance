import { createContext, useEffect, useState } from "react";
import { ICoinPrice, TCoinPriceMap } from "../../shared/types/coin";
import { CoinPriceFixedTime } from "./CoinPriceFIxedTime";
import { CoinPriceRealTime } from "./CoinPriceRealTime";
import { Grid } from "@mui/material";

export const CoinContext = createContext<{
  coinPricesArr: ICoinPrice[];
  coinPricesMap: TCoinPriceMap;
}>({
  coinPricesArr: [],
  coinPricesMap: {},
});
export const Coin = () => {
  let [coinPrices, setCoinPrices] = useState<ICoinPrice[]>([]);

  useEffect(() => {
    async function fetchCoinPrices() {
      const endpoint = "https://fapi.binance.com/fapi/v2/ticker/price";
      const response = await fetch(endpoint);
      const data = await response.json();
      setCoinPrices(data);
    }
    fetchCoinPrices();
  }, []);
  return (
    <CoinContext.Provider
      value={{
        coinPricesMap: coinArrayToMap(coinPrices),
        coinPricesArr: coinPrices,
      }}
    >
      <Grid container spacing={{ xs: 3, sm: 6 }}>
        <CoinPriceFixedTime />
        <CoinPriceRealTime />
      </Grid>
    </CoinContext.Provider>
  );
};

function coinArrayToMap(coinArr: ICoinPrice[]) {
  let coinMap: TCoinPriceMap = {};

  for (let coin of coinArr) {
    coinMap[coin.symbol] = coin;
  }
  return coinMap;
}
