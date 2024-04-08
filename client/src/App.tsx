import "./App.css";
import { CoinPriceFixedTime } from "./pages/coin/CoinPriceFIxedTime";
import { CoinPriceRealTime } from "./pages/coin/CoinPriceRealTime";
import { Setting } from "./pages/setting/Setting";


function App() {
  return (
    <>
      <div>
        <Setting />
        <CoinPriceFixedTime/>
        <CoinPriceRealTime/>
      </div>
    </>
  );
}

export default App;
