import { Box, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { CustomTable, StrictField } from "../../components/Table/Customtable";
import { SocketContext } from "../../context/SocketContext";
import {
  ICoinPrice,
  ICoinPriceChange,
  TCoinPriceMap,
} from "../../shared/types/coin";
import { CoinContext } from "./Coin";

export const CoinPriceRealTime = () => {
  const socket = useContext(SocketContext);
  const [coinPrices, setCoinPrices] = useState<ICoinPriceChange[]>([]);
  const coinPricesFilterd = coinPrices.filter(
    (coin) => parseFloat(coin.percentChange) >= 5
  );
  const { coinPricesMap } = useContext(CoinContext);
  const fields: StrictField<ICoinPriceChange>[] = [
    {
      header: "Coin_USD",
      fieldKey: "symbol",
      width: 300,
    },
    {
      header: "Price",
      fieldKey: "price",
      width: 300,
    },
    {
      header: "Percent Change",
      fieldKey: "percentChange",
      width: 300,
      render: ({ percentChange }) => {
        let percentFloat = parseFloat(percentChange);
        let isUp = percentFloat >= 0;
        return (
          <Typography color={isUp ? "green" : "red"}>
            {`${percentChange} %`}
          </Typography>
        );
      },
    },
  ];
  useEffect(() => {
    socket?.on("symbols-price", (symbolPrice: ICoinPrice[]) => {
      const coinAddFieldPercentChange = coinWithPercentChange(
        symbolPrice,
        coinPricesMap
      );
      const coinSortedByPercentChange = sortCoinByPercentChange(
        coinAddFieldPercentChange
      );
      setCoinPrices(coinSortedByPercentChange);
    });

    return () => {
      socket?.off("symbols-price");
    };
  }, [coinPricesMap]);

  return (
    <>
      <Grid item xs={12} sm={7}>
        <Box>
          <Typography variant="h5">Coin Price Real Time</Typography>
          <CustomTable data={coinPrices} fields={fields} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <CoinPriceRealTimeFilter fields={fields} data={coinPricesFilterd} />
      </Grid>
    </>
  );
};

type Props = {
  fields: StrictField<ICoinPriceChange>[];
  data: ICoinPriceChange[];
};
const CoinPriceRealTimeFilter = ({ fields, data }: Props) => {
  return (
    <Grid item xs={12} sm={7}>
      <Box>
        <Typography variant="h5">
          Coin Price Real Time greater than 5%
        </Typography>
        <CustomTable data={data} fields={fields} />
      </Box>
    </Grid>
  );
};

function coinWithPercentChange(coinArr: ICoinPrice[], coinMap: TCoinPriceMap) {
  return coinArr.map((coin) => {
    let currCoinPrice = parseFloat(coin.price);
    let coinKey: string = coin.symbol;
    let originCoinPrice = parseFloat(coinMap[coinKey]?.price);
    return {
      ...coin,
      percentChange: ((currCoinPrice / originCoinPrice - 1) * 100).toFixed(2),
    };
  });
}

function sortCoinByPercentChange(coinArr: ICoinPriceChange[]) {
  return coinArr.sort(
    (a, b) => parseFloat(b.percentChange) - parseFloat(a.percentChange)
  );
}
