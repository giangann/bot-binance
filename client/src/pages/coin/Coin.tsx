import { Grid, Typography } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { getApi } from "../../request/request";
import { ICoinPrice, TCoinPriceMap } from "../../shared/types/coin";
import { CoinPriceFixedTime } from "./CoinPriceFIxedTime";
import { CoinPriceRealTime } from "./CoinPriceRealTime";
import data from "./data.json";

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
      try {
        const response = await getApi<ICoinPrice[]>("coin-price-1am");
        if (response.success) setCoinPrices(response.data);
        else {
          console.log("response", response);
          setCoinPrices(data.data);
        }
      } catch (err) {
        console.log(err);
        setCoinPrices(data.data);
      }
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
      <GoToFullTable />
      <Grid container columnSpacing={{ xs: 3, sm: 6 }}>
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

const GoToFullTable = () => {
  return (
    <a href="/mix-table" target="_blank">
      <Typography fontSize={22} fontWeight={600}>
        Xem bảng đầy đủ
      </Typography>
    </a>
  );
};
