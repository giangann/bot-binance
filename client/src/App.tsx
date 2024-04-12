import { Box } from "@mui/material";
import "./App.css";
import { Balance } from "./pages/account/Balance";
import { OrderHistory } from "./pages/account/OrderHistory";
import { TradeHistory } from "./pages/account/TradeHistory";
import { Coin } from "./pages/coin/Coin";
import { Setting } from "./pages/setting/Setting";

function App() {
  return (
    <Box sx={{ maxWidth: 1500, margin: "auto", padding: { xs: 1, sm: 2 } }}>
      <Setting />
      <Coin />
      <Balance />
      <OrderHistory />
      <TradeHistory />
    </Box>
  );
}

export default App;
