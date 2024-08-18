import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Balance } from "./pages/account/Balance";
import { Coin } from "./pages/coin/Coin";
import { UpdateCoinPrice } from "./pages/coin/UpdateCoinPrice";
// import { TradeHistory } from "./pages/account/TradeHistory";
// import { OrderHistory } from "./pages/account/OrderHistory";
export const Home = () => {
  return (
    <Box>
      <Coin />
      <Balance />

      <GoToOrderChainsList />

      <div style={{ marginTop: 36 }} />
      <GoToDatasetList />

      <UpdateCoinPrice />
      {/* <OrderHistory /> */}
      {/* <TradeHistory />  */}
    </Box>
  );
};

const GoToOrderChainsList = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Button variant="contained" onClick={() => navigate("/chuoi-lenh")}>
        + Tới lịch sử hoạt động - Bot
      </Button>
    </Box>
  );
};

const GoToDatasetList = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Button variant="contained" onClick={() => navigate("/dataset")} color={"inherit"}>
        + Tới bộ dữ liệu - Dataset
      </Button>
    </Box>
  );
};
