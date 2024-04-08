import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CustomTable, StrictField } from "../../components/Table/Customtable";

type TCoinPrice = {
  symbol: string;
  price: string;
  time: number;
};
export const CoinPriceRealTime = () => {
  let [coinPrices, setCoinPrices] = useState([]);
  const fields: StrictField<TCoinPrice>[] = [
    {
      header: "Coin",
      fieldKey: "symbol",
      width: 150,
    },
    {
      header: "Price",
      fieldKey: "price",
      width: 250,
    },
  ];
  useEffect(() => {
    async function fetchCoinPrices() {
      const endpoint = "https://fapi.binance.com/fapi/v2/ticker/price";
      const response = await fetch(endpoint);
      const data = await response.json();
      setCoinPrices(data);
    }
    fetchCoinPrices();

    const interval = setInterval(() => {
      fetchCoinPrices();
    }, 5000);

    // clean up
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Typography variant="h5">Coin Price Real Time</Typography>
      <CustomTable data={coinPrices} fields={fields} />
    </Box>
  );
};
