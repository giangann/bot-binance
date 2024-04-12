import "./App.css";
import { Balance } from "./pages/account/Balance";
import { OrderHistory } from "./pages/account/OrderHistory";
import { TradeHistory } from "./pages/account/TradeHistory";
import { Coin } from "./pages/coin/Coin";
import { Setting } from "./pages/setting/Setting";

function App() {
  return (
    <>
      <div style={{ maxWidth: 1500, margin: "auto" }}>
        <Setting />
        <Coin />
        <Balance />
        <OrderHistory />
        <TradeHistory/>
      </div>
    </>
  );
}

export default App;
