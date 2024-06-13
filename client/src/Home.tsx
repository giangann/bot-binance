import { Box } from "@mui/material";
import { Balance } from "./pages/account/Balance";
// import { OrderHistory } from "./pages/account/OrderHistory";
// import { TradeHistory } from "./pages/account/TradeHistory";
import { OrderCreate } from "./pages/account/OrderCreate";
import { Coin } from "./pages/coin/Coin";
import { UpdateCoinPrice } from "./pages/coin/UpdateCoinPrice";
export const Home = () => {
  return (
    <Box>
      <Coin />
      <Balance />

      <OrderCreate/>

      <UpdateCoinPrice/>
      {/* <OrderHistory /> */}
      {/* <TradeHistory />  */}
    </Box>
  );
};
