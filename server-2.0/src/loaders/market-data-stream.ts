import { WebSocket } from "ws";
import {
  TMarkPriceStream,
  TTickerPriceStream,
} from "../types/websocket/binance-stream.type";
import { binanceStreamToSymbolPrice } from "../ultils/helper";
import loggerService from "../services/logger.service";

const futurePriceStream = () => {
  const baseWs = "wss://fstream.binance.com";
  const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval

  const ws = new WebSocket(wsURL);
  ws.on("open", () => {
    loggerService.saveDebugAndClg(
      "WebSocket Binance Future Market Data Stream connection established, ready to forward push message"
    );
  });

  ws.on("message", (msg: any) => {
    try {
      const messageString = msg.toString(); // Convert buffer to string
      const messageJSON: TMarkPriceStream | TTickerPriceStream =
        JSON.parse(messageString); // Parse string as JSON

      // prepare emit
      const emitMsg = binanceStreamToSymbolPrice(messageJSON);
      global.wsServerInstance.emit("future-binance-stream-forward", emitMsg);
    } catch (err) {
      loggerService.saveError(err);
    }
  });

  ws.on("error", (error: any) => {
    loggerService.saveError(error);
    console.error("WebSocket error:", error);
  });
  ws.on("close", () => {
    loggerService.saveDebugAndClg("WebSocket connection closed.");
  });
};

const testnetPriceStream = () => {
  try {
    const baseWs = "wss://fstream.binancefuture.com";
    const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval

    const ws = new WebSocket(wsURL);
    ws.on("open", () => {
      loggerService.saveDebugAndClg(
        "WebSocket Binance Future <Testnet> Market Data Stream connection established, ready to forward push message"
      );
    });
    ws.on("message", (msg: any) => {
      try {
        const messageString = msg.toString(); // Convert buffer to string
        const messageJSON: TMarkPriceStream | TTickerPriceStream =
          JSON.parse(messageString); // Parse string as JSON

        // prepare emit
        const emitMsg = binanceStreamToSymbolPrice(messageJSON);
        global.wsServerInstance.emit("testnet-binance-stream-forward", emitMsg);
      } catch (err) {
        loggerService.saveError(err);
      }
    });

    ws.on("error", (error: any) => {
      loggerService.saveError(error);
      console.error("WebSocket error:", error);
    });
    ws.on("close", () => {
      loggerService.saveDebugAndClg("WebSocket connection closed.");
    });
  } catch (err) {
    loggerService.saveError(err)
  }
};

export const subcribeAndForwardBinanceStream = () => {
  testnetPriceStream();
  futurePriceStream();
};
