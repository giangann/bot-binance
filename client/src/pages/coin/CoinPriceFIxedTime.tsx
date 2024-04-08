import { Box, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { CustomTable, StrictField } from "../../components/Table/Customtable";
import { ICoinPrice } from "../../shared/types/coin";
import { CoinContext } from "./Coin";

export const CoinPriceFixedTime = () => {

  const { coinPricesArr } = useContext(CoinContext);
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

  return (
    <Grid item xs={12} sm={5}>
      <Box>
        <Typography variant="h5">Coin Price in 1:00 AM</Typography>
        <CustomTable data={coinPricesArr} fields={fields} />
      </Box>
    </Grid>
  );
};
