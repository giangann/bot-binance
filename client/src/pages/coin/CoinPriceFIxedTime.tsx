import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CustomTable, StrictField } from "../../components/Table/Customtable";
import { getApi } from "../../request/request";
import { ICoinPrice } from "../../shared/types/coin";

export const CoinPriceFixedTime = () => {
  let [coinPrices, setCoinPrices] = useState<ICoinPrice[]>([]);
  const fields: StrictField<ICoinPrice>[] = [
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
  ];
  useEffect(() => {
    async function fetchCoinPrices() {
      const response = await getApi<ICoinPrice[]>("coin-price-1am");
      if (response.success) setCoinPrices(response.data);
    }
    fetchCoinPrices();
  }, []);

  return (
    <Grid item xs={12} sm={5}>
      <Box>
        <Typography variant="h5">Coin Price in 1:00 AM</Typography>
        <CustomTable data={coinPrices} fields={fields} />
      </Box>
    </Grid>
  );
};
