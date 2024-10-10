import dotenv from "dotenv";
import { combineTickerAndMarketToPrices } from "../helper";
import { Logger } from "../logger";
import { TResponse, TSymbolPrice } from "../type";
import { TBinanceError, TSymbolMarketPrice, TSymbolTickerPrice } from "../types/rest-api";
import { TExchangeInfo } from "../types/rest-api/exchange-info.type";
import { TNewOrder } from "../types/rest-api/order.type";
import { TPosition } from "../types/rest-api/position.type";
import { isBinanceError, paramsToQueryWithSignature } from "../ultils/helper";
import { TAccount } from "../types/rest-api/account.type";
import { TSymbolMarketPriceKline } from "../types/rest-api/symbol-prices-kline.type";
dotenv.config();

export class MyBinanceService {
  private baseRestApiUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private recvWindow: number;
  private logger: Logger;

  constructor() {
    this.baseRestApiUrl = process.env.BINANCE_BASE_URL;
    this.apiKey = process.env.BINANCE_API_KEY ?? "";
    this.apiSecret = process.env.BINANCE_API_SECRET ?? "";
    this.recvWindow = parseInt(process.env.RECV_WINDOW) || 10000;
    this.logger = new Logger();
  }

  /**
   * getSymbolTickerPrices
   */
  public async getSymbolTickerPrices() {
    try {
      const endpoint = "/fapi/v2/ticker/price";
      const baseUrl = this.baseRestApiUrl;
      const url = `${baseUrl}${endpoint}`;
      const response = await fetch(url);
      const responseJson: TResponse<TSymbolTickerPrice[]> = await response.json();

      if (response.status !== 200) {
        throw new Error(JSON.stringify(responseJson));
      }
      if (response.status === 200) {
        return responseJson as TSymbolTickerPrice[];
      }
    } catch (error: any) {
      this.logger.saveError(error);
      throw error;
    }
  }

  /**
   * getSymbolMarketPrices
   */
  public async getSymbolMarketPrices() {
    try {
      const endpoint = "/fapi/v1/premiumIndex";
      const baseUrl = this.baseRestApiUrl;
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url);
      const responseJson: TResponse<TSymbolMarketPrice[]> = await response.json();

      if (response.status !== 200) {
        throw new Error(JSON.stringify(responseJson));
      }
      if (response.status === 200) {
        return responseJson as TSymbolMarketPrice[];
      }
    } catch (error: any) {
      this.logger.saveError(error);
      throw error;
    }
  }

  /**
   * placeOrderRest
   */
  public async createMarketOrder(symbol: string, side: "SELL" | "BUY", quantity: number, arbitraryId?: string) {
    try {
      const type = "market";
      const endpoint = "/fapi/v1/order";

      const baseUrl = this.baseRestApiUrl;
      const apiSecret = this.apiSecret;
      const apiKey = this.apiKey;

      const paramsNow = { recvWindow: this.recvWindow, timestamp: Date.now() };

      let orderParams = {
        symbol,
        type,
        quantity,
        side,
        newClientOrderId: arbitraryId,
        ...paramsNow,
      };

      const queryString = paramsToQueryWithSignature(apiSecret, orderParams);
      const url = `${baseUrl}${endpoint}?${queryString}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "X-MBX-APIKEY": apiKey,
          "Content-Type": "application/json",
        },
      });
      const responseJson: TResponse<TNewOrder> = await response.json();

      if (response.status !== 200) {
        return { ...responseJson, clientOrderId: arbitraryId } as TBinanceError & Pick<TNewOrder, "clientOrderId">;
      }
      if (response.status === 200) {
        return responseJson as TNewOrder;
      }
    } catch (error: any) {
      this.logger.saveError(error);
      throw error;
    }
  }

  public getPositions = async (): Promise<TPosition[]> => {
    try {
      const endpoint = "/fapi/v2/positionRisk";
      const baseUrl = this.baseRestApiUrl;
      const apiSecret = this.apiSecret;
      const apiKey = this.apiKey;

      const paramsNow = { recvWindow: this.recvWindow, timestamp: Date.now() };

      const queryString = paramsToQueryWithSignature(apiSecret, paramsNow);
      const url = `${baseUrl}${endpoint}?${queryString}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-MBX-APIKEY": apiKey,
          "Content-Type": "application/json",
        },
      });
      const responseJson: TResponse<TPosition[]> = await response.json();

      if (response.status !== 200) {
        throw new Error(JSON.stringify(responseJson));
      }
      if (response.status === 200) {
        return responseJson as TPosition[];
      }
    } catch (error: any) {
      this.logger.saveError(error);
      throw error;
    }
  };

  public closeAllPositions = async (): Promise<{ success: number; failure: number }> => {
    const positions = await this.getPositions();
    const positionsNotZero = positions.filter((position) => parseFloat(position.positionAmt) !== 0);
    const shortPositions = positionsNotZero.filter((position) => parseFloat(position.positionAmt) < 0);
    const longPositions = positionsNotZero.filter((position) => parseFloat(position.positionAmt) > 0);

    const sellPromises = longPositions.map((position) => this.createMarketOrder(position.symbol, "SELL", parseFloat(position.positionAmt)));
    const buyPromises = shortPositions.map((position) => this.createMarketOrder(position.symbol, "BUY", -parseFloat(position.positionAmt)));

    const promises = [...sellPromises, ...buyPromises];

    const responses = await Promise.all(promises);

    const result = { success: 0, failure: 0 };
    for (const response of responses) {
      if (isBinanceError(response)) {
        result.failure += 1;
      } else {
        result.success += 1;
      }
    }
    return result;
  };

  public getExchangeInfo = async (): Promise<TExchangeInfo> => {
    try {
      const endpoint = "/fapi/v1/exchangeInfo";
      const baseUrl = this.baseRestApiUrl;
      const apiKey = this.apiKey;
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-MBX-APIKEY": apiKey,
          "Content-Type": "application/json",
        },
      });
      const responseJson: TResponse<TExchangeInfo> = await response.json();

      if (response.status !== 200) {
        throw new Error(JSON.stringify(responseJson));
      }
      if (response.status === 200) {
        return responseJson as TExchangeInfo;
      }
    } catch (error: any) {
      this.logger.saveError(error);
      throw error;
    }
  };

  public getAccountInfo = async (): Promise<TAccount> => {
    try {
      const endpoint = "/fapi/v2/account";
      const baseUrl = this.baseRestApiUrl;
      const apiSecret = this.apiSecret;
      const apiKey = this.apiKey;

      const paramsNow = { recvWindow: this.recvWindow, timestamp: Date.now() };

      const queryString = paramsToQueryWithSignature(apiSecret, paramsNow);
      const url = `${baseUrl}${endpoint}?${queryString}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-MBX-APIKEY": apiKey,
          "Content-Type": "application/json",
        },
      });
      const responseJson: TResponse<TAccount> = await response.json();

      if (response.status !== 200) {
        throw new Error(JSON.stringify(responseJson));
      }
      if (response.status === 200) {
        return responseJson as TAccount;
      }
    } catch (error: any) {
      this.logger.saveError(error);
      throw error;
    }
  };

  /**
   * getSymbolPrices
   */
  public async getSymbolPrices(): Promise<TSymbolPrice[]> {
    const symbolTickerPrices = await this.getSymbolTickerPrices();
    const symbolMarketPrices = await this.getSymbolMarketPrices();

    const symbolPrices = combineTickerAndMarketToPrices(symbolTickerPrices, symbolMarketPrices);

    return symbolPrices;
  }

  /**
   * name
   */
  public async getMarketPriceKlines() : Promise<TSymbolMarketPriceKline[]>{
    try {
      const endpoint = "/fapi/v1/markPriceKlines";
      const queryString = `symbol=BTCUSDT&interval=1m&limit=60`;
      const baseUrl = this.baseRestApiUrl;
      const url = `${baseUrl}${endpoint}?${queryString}`;

      const response = await fetch(url);
      const responseJson: TResponse<TSymbolMarketPriceKline[]> = await response.json();

      if (isBinanceError(responseJson)) {
        throw new Error(JSON.stringify(responseJson));
      }
      if (response.status === 200) {
        return responseJson as TSymbolMarketPriceKline[];
      }
    } catch (error: any) {
      this.logger.saveError(error);
      throw error;
    }
  }
}
