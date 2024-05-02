import { WebSocket } from "ws";
import { TMarkPriceStream, TTickerPriceStream } from "../types/binance-stream";
import { binanceStreamToSymbolPrice } from "../ultils/helper.ultil";

const futurePriceStream = () => {
  const baseWs = "wss://fstream.binance.com";
  const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval

  const ws = new WebSocket(wsURL);
  ws.on("open", () => {
    console.log("WebSocket connection established.");
  });

  ws.on("message", (msg: any) => {
    const messageString = msg.toString(); // Convert buffer to string
    const messageJSON: TMarkPriceStream | TTickerPriceStream =
      JSON.parse(messageString); // Parse string as JSON

    // prepare emit
    const emitMsg = binanceStreamToSymbolPrice(messageJSON);
    global.wsServerGlob.emit("future-binance-stream-forward", emitMsg);
  });

  ws.on("error", (error: any) => {
    console.error("WebSocket error:", error);
  });
  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
};

const testnetPriceStream = () => {
  const baseWs = "wss://fstream.binancefuture.com";
  const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval

  const ws = new WebSocket(wsURL);
  ws.on("open", () => {
    console.log("WebSocket connection established.");
  });
  ws.on("message", (msg: any) => {
    console.log("received new msg in testnet");
    const messageString = msg.toString(); // Convert buffer to string
    const messageJSON: TMarkPriceStream | TTickerPriceStream =
      JSON.parse(messageString); // Parse string as JSON

    // prepare emit
    const emitMsg = binanceStreamToSymbolPrice(messageJSON);
    global.wsServerGlob.emit("testnet-binance-stream-forward", emitMsg);
  });
  ws.on("error", (error: any) => {
    console.error("WebSocket error:", error);
  });
  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
};

export const subcribeAndForwardBinanceStream = () => {
  testnetPriceStream();
  futurePriceStream();
};
