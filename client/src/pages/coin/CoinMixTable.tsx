// OPTION 1: -------------- 1 TABLE
// symbol,

import { Grid } from "@mui/material";
import { SymbolMarketTickerPriceAndPercentChange } from "./SymbolMarketTickerPriceAndPercentChange";

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
  const baseUrlTestNet = "https://testnet.binancefuture.com";
  const baseUrlFuture = "https://fapi.binance.com";

  const connectionTestnet = "testnet-binance-stream-forward";
  const connectionFuture = "future-binance-stream-forward";
  
  return (
    <Grid container>
      <Grid item xs={12}>
        <SymbolMarketTickerPriceAndPercentChange
          title={"Coin testnet"}
          baseUrl={baseUrlTestNet}
          connection={connectionTestnet}
        />
      </Grid>
      <Grid item xs={12}>
        <SymbolMarketTickerPriceAndPercentChange
          title={"Coin future"}
          baseUrl={baseUrlFuture}
          connection={connectionFuture}
        />
      </Grid>
    </Grid>
  );
};
