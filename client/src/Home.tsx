import { Box } from "@mui/material";
import { Balance } from "./pages/account/Balance";
// import { OrderHistory } from "./pages/account/OrderHistory";
// import { TradeHistory } from "./pages/account/TradeHistory";
import { Coin } from "./pages/coin/Coin";
import { Setting } from "./pages/setting/Setting";
import { OrderCreate } from "./pages/account/OrderCreate";
export const Home = () => {
  return (
    <Box>
      <Setting />
      <Coin />
      <Balance />

      <OrderCreate/>
      {/* <OrderHistory /> */}
      {/* <TradeHistory />  */}
    </Box>
  );
};
