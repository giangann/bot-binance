import "./App.css";
import { Coin } from "./pages/coin/Coin";
import { Setting } from "./pages/setting/Setting";

function App() {
  return (
    <>
      <div style={{maxWidth:1500, margin:'auto'}}>
        <Setting />
        <Coin />
      </div>
    </>
  );
}

export default App;
