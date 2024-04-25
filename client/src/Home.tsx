import { Box } from "@mui/material";
import { Balance } from "./pages/account/Balance";
// import { OrderHistory } from "./pages/account/OrderHistory";
// import { TradeHistory } from "./pages/account/TradeHistory";
import { Coin } from "./pages/coin/Coin";
import { OrderCreate } from "./pages/account/OrderCreate";
import { TestApi } from "./pages/account/TestApi";
export const Home = () => {
  return (
    <Box>
      <TestApi/>
      <Coin />
      <Balance />

      <OrderCreate/>
      {/* <OrderHistory /> */}
      {/* <TradeHistory />  */}
    </Box>
  );
};
