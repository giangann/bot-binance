import { WebSocket } from "ws";
import {
  TMarkPriceStream,
  TTickerPriceStream,
} from "../types/websocket/binance-stream.type";
import { binanceStreamToSymbolPrice } from "../ultils/helper";

const futurePriceStream = () => {
  const baseWs = "wss://fstream.binance.com";
  const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval

  const ws = new WebSocket(wsURL);
  ws.on("open", () => {
    console.log("WebSocket Binance Future Market Data Stream connection established, ready to forward push message");
  });

  ws.on("message", (msg: any) => {
    const messageString = msg.toString(); // Convert buffer to string
    const messageJSON: TMarkPriceStream | TTickerPriceStream =
      JSON.parse(messageString); // Parse string as JSON

    // prepare emit
    const emitMsg = binanceStreamToSymbolPrice(messageJSON);
    global.wsServerInstance.emit("future-binance-stream-forward", emitMsg);
  });

  ws.on("error", (error: any) => {
    console.error("WebSocket error:", error);
  });
  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
};

const testnetPriceStream = () => {
  try {
    const baseWs = "wss://fstream.binancefuture.com";
    const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval

    const ws = new WebSocket(wsURL);
    ws.on("open", () => {
      console.log("WebSocket Binance Future <Testnet> Market Data Stream connection established, ready to forward push message");
    });
    ws.on("message", (msg: any) => {
      try {
      } catch (err) {
        console.log("err", err, " with msg: ", err.message);
        throw err;
      }
      const messageString = msg.toString(); // Convert buffer to string
      const messageJSON: TMarkPriceStream | TTickerPriceStream =
        JSON.parse(messageString); // Parse string as JSON

      // prepare emit
      const emitMsg = binanceStreamToSymbolPrice(messageJSON);
      global.wsServerInstance.emit("testnet-binance-stream-forward", emitMsg);
    });

    ws.on("error", (error: any) => {
      console.error("WebSocket error:", error);
    });
    ws.on("close", () => {
      console.log("WebSocket connection closed.");
    });
  } catch (err) {
    throw err;
  }
};

export const subcribeAndForwardBinanceStream = () => {
  testnetPriceStream();
  futurePriceStream();
};
