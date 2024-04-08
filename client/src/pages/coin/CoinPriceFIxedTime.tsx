import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CustomTable, StrictField } from "../../components/Table/Customtable";

type TCoinPrice = {
  symbol: string;
  price: string;
  time: number;
};
export const CoinPriceFixedTime = () => {
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
  }, []);

  return (
    <Box>
      <Typography variant="h5">Coin Price in 1:00 AM</Typography>
      <CustomTable data={coinPrices} fields={fields} />
    </Box>
  );
};
