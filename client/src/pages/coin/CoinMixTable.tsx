// OPTION 1: -------------- 1 TABLE
// symbol,

import { Grid } from "@mui/material";
import { CoinFuture } from "./CoinFuture";
import { CoinTestnetFuture } from "./CoinTestnetFuture";

// f_price_1AM
// f_mark_price_1AM
// price_1AM
// mark_price_1AM

// f_price (future ticker price)
// f_mark_price (future market price)
// price (testnet ticker price)
// mark_price (testnet market price)

// f_price_percent_change
// f_mark_price_percent_change
// price_percent_change
// mark_price_percent_change

// OPTION 2 : -------------- 2 TABLE

export const CoinMixTable = () => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <CoinTestnetFuture />
      </Grid>
      <Grid item xs={6}>
        <CoinFuture />
      </Grid>
    </Grid>
  );
};
