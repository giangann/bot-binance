import { Box, Button, Typography } from "@mui/material";
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

      <div style={{ marginTop: 36 }} />
      <GoToOrderChainsList />

      <div style={{ marginTop: 36 }} />
      <GoToBotTest />

      <div style={{ marginTop: 36 }} />
      <GoToDatasetList />

      <UpdateCoinPrice />
      {/* <OrderHistory /> */}
      {/* <TradeHistory />  */}

      <div style={{ marginTop: 36 }} />
      <VersionConfirm />

      <div style={{ marginTop: 36 }} />
    </Box>
  );
};

const GoToOrderChainsList = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Button variant="contained" onClick={() => navigate("/chuoi-lenh")}>
        + Tới lịch sử hoạt động - BOT_PROD
      </Button>
    </Box>
  );
};

const GoToBotTest = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Button variant="outlined" color="error" onClick={() => navigate("/bot-test")}>
        + Tới thử nghiệm - BOT_TEST
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

const VersionConfirm = () => {
  return <Typography sx={{ color: "black" }}>Last update: Prepare deploy ec2, add ngrok-skip-browser-warning header </Typography>;
};
