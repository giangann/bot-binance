import dotenv from "dotenv";
import WebSocket from "ws";
import { exchangeInfoSymbolsToMap, positionsToMap, symbolPricesToMap } from "../helper";
import { IMarketOrderChainRecord } from "../interfaces/market-order-chain.interface";
import { TOrderInfo, TOrderInfoMap, TOrderPiece, TOrderPiecesMap, TSymbolPrice, TSymbolPricesMap } from "../type";
import { TSymbolPnlManaging, TSymbolPnlManagingsMap } from "../types/bot/bot.types";
import { TExchangeInfoSymbol, TExchangeInfoSymbolsMap } from "../types/rest-api/exchange-info.type";
import { TPosition, TPositionsMap } from "../types/rest-api/position.type";
import { TSymbolPricesStream } from "../types/websocket";
import { removeArrayElMutate, symbolPnlManagingsMapFromAbleSymbols, updateObject } from "../ultils/helper";
dotenv.config();
export class BotCache {
  private symbolCurrentPricesMap: TSymbolPricesMap;
  private symbolStartPricesMap: TSymbolPricesMap;
  protected positionsMap: TPositionsMap;
  private openingChain: IMarketOrderChainRecord;
  private orderPiecesMap: TOrderPiecesMap;
  private orderInfosMap: TOrderInfoMap;
  private ableSymbols: string[];
  private symbolPnlManagingsMap: TSymbolPnlManagingsMap;
  private wsConnMarketDataStream: WebSocket;
  private exchangeInfoSymbolsMap: TExchangeInfoSymbolsMap;
  // define orderPieces and botConfig (orderChain)

  constructor(
    symbolStartPrices: TSymbolPrice[],
    symbolCurrentPrices: TSymbolPrice[],
    positions: TPosition[],
    exchangeInfoSymbols: TExchangeInfoSymbol[],
    openingChain: IMarketOrderChainRecord,
    ableSymbols: string[]
  ) {
    this.symbolStartPricesMap = symbolPricesToMap([...symbolStartPrices]);
    this.symbolCurrentPricesMap = symbolPricesToMap([...symbolCurrentPrices]);
    this.positionsMap = positionsToMap(positions);
    this.openingChain = openingChain;
    this.orderPiecesMap = {};
    this.orderInfosMap = {};
    this.ableSymbols = ableSymbols;
    this.symbolPnlManagingsMap = symbolPnlManagingsMapFromAbleSymbols(ableSymbols, {
      is_max_pnl_start_reached: false,
      max_pnl_start: openingChain.symbol_max_pnl_start,
    });
    this.exchangeInfoSymbolsMap = exchangeInfoSymbolsToMap(exchangeInfoSymbols);
    this.wsConnMarketDataStream = new WebSocket(`${process.env.BINANCE_BASE_WS_MARK_URL}/stream?streams=!markPrice@arr/!ticker@arr`);
  }

  public getSymbolStartPricesMap() {
    return this.symbolStartPricesMap;
  }

  public getSymbolCurrentPricesMap() {
    return this.symbolCurrentPricesMap;
  }

  public getSymbolStartPrice(symbol: string): TSymbolPrice {
    const symbolStartPrice = this.symbolStartPricesMap[symbol];
    if (!symbolStartPrice) throw new Error(`Error: Start_Price of ${symbol} not found !`);
    return symbolStartPrice;
  }

  public getSymbolPrevPrice(symbol: string): string | null {
    const symbolOrders = this.getOrdersOfSymbol(symbol);

    if (symbolOrders === null) return null;
    if (symbolOrders.length <= 0) return null;

    const lastestOrder = symbolOrders[0];
    if (!lastestOrder) return null;

    return lastestOrder.price;
  }

  public getSymbolCurrentPrice(symbol: string): TSymbolPrice | undefined {
    const symbolCurrentPrice = this.symbolCurrentPricesMap[symbol];
    return symbolCurrentPrice;
  }

  public updateSymbolCurrentPricesMap(symbolPrices: TSymbolPrice[]) {
    for (let symbolPrice of symbolPrices) {
      const symbol = symbolPrice.symbol;
      this.symbolCurrentPricesMap[symbol] = symbolPrice;
    }
  }

  public updateSymbolCurrentTickerPrice(symbol: string, newTickerPrice: string) {
    if (!this.symbolCurrentPricesMap[symbol]) return;
    this.symbolCurrentPricesMap[symbol]!.tickerPrice = newTickerPrice;
  }

  public updateSymbolCurrentMarketPrice(symbol: string, newMarketPrice: string) {
    if (!this.symbolCurrentPricesMap[symbol]) return;
    this.symbolCurrentPricesMap[symbol]!.marketPrice = newMarketPrice;
  }

  public getSymbolPosition(symbol: string): TPosition | null {
    const symbolPosition = this.positionsMap[symbol] ?? null;
    return symbolPosition;
  }

  public isSymbolPositionAmtZero(symbol: string): boolean {
    const symbolPosition = this.getSymbolPosition(symbol);
    const symbolPositionAmt = symbolPosition?.positionAmt;
    const symbolPositionAmtNumber: number = parseFloat(symbolPositionAmt as string) || 0; // (1)0 or (2)number>0

    return symbolPositionAmtNumber === 0;
  }

  public updatePositionsMap(positions: TPosition[]) {
    for (let position of positions) {
      const symbol = position.symbol;
      this.positionsMap[symbol] = position;
    }
  }

  public removeAbleSymbol(symbol: string) {
    removeArrayElMutate(this.ableSymbols, symbol);
  }

  public getSymbolPnlManaging(symbol: string) {
    return this.symbolPnlManagingsMap[symbol] ?? null;
  }

  public updateSymbolPnlManaging<K extends keyof TSymbolPnlManaging>(symbol: string, key: K, value: TSymbolPnlManaging[K]) {
    const symbolPnlManaging = this.getSymbolPnlManaging(symbol);
    if (symbolPnlManaging) {
      this.symbolPnlManagingsMap[symbol] = {
        ...symbolPnlManaging,
        [key]: value,
      };
    }
  }

  /**
   * getBotConfig
   * Query to database to get one opening order chain
   */
  public getBotConfig() {
    const openingChain = this.openingChain;
    if (!openingChain) throw new Error(`Bot config not found`);
    return openingChain;
  }

  public updateBotConfig<K extends keyof Pick<IMarketOrderChainRecord, "is_max_pnl_start_reached" | "max_pnl_start" | "pnl_to_stop">>(
    key: K,
    value: IMarketOrderChainRecord[K]
  ) {
    updateObject(this.openingChain, key, value);
  }

  public getOrdersOfSymbol(symbol: string): TOrderPiece[] | null {
    const orders = this.orderPiecesMap[symbol] ?? null;
    return orders;
  }

  public updateOrderPiecesOfSymbol(symbol: string, order: TOrderPiece) {
    const symbolOrders = this.getOrdersOfSymbol(symbol);
    if (!symbolOrders) {
      // is first order
      this.orderPiecesMap[symbol] = [order];
    } else {
      // not is first order
      this.orderPiecesMap[symbol] = [order, ...symbolOrders];
    }
  }

  public getOrderInfo(id: string) {
    return this.orderInfosMap[id] ?? null;
  }

  public updateOrderInfoMap(orderInfo: TOrderInfo) {
    const id = orderInfo.arbitraryId;
    this.orderInfosMap[id] = orderInfo;
  }

  public getAbleSymbols() {
    return this.ableSymbols;
  }

  public getExchangeInfoSymbolsMap() {
    return this.exchangeInfoSymbolsMap;
  }

  // about Profit and Loss calculate
  public calculatePositionPnl(symbol: string): number {
    const symbolOrders = this.getOrdersOfSymbol(symbol);
    if (!symbolOrders) return 0;
    const symbolPosition = this.getSymbolPosition(symbol);
    if (!symbolPosition) return 0;
    const currentQty = parseFloat(symbolPosition.positionAmt);
    if (currentQty === 0) return 0;

    if (symbolOrders && symbolPosition) {
      let totalPurchased = 0;
      let tempQty = 0;

      // loop from first order to latest order
      const symbolOrdersCopyReverse = symbolOrders.slice().reverse(); // make a reverse copy array without modify it
      for (let order of symbolOrdersCopyReverse) {
        const { side, quantity } = order;
        const orderQtyNumber = quantity;
        if (side === "BUY") {
          totalPurchased += parseFloat(order.price) * quantity;
          tempQty += orderQtyNumber;
        }
        if (side === "SELL") {
          tempQty -= orderQtyNumber;
        }
        if (tempQty === 0) totalPurchased = 0;
      }

      // FORMULAR: unrealizePnl = (currPrice - avgPrice) * currentQty
      //           avgPrice = totalPurchase / totalQuantity
      const currentPrice = this.getSymbolCurrentPrice(symbol);
      const currentMarketPrice = currentPrice.marketPrice;
      const currentMarketPriceNumber = parseFloat(currentMarketPrice as string);

      const avgPurchasedPrice = totalPurchased / currentQty;
      const unrealizedPnl = (currentMarketPriceNumber - avgPurchasedPrice) * currentQty;

      return unrealizedPnl;
    }

    return 0;
  }

  public calculateTotalPnl(): number {
    const positionsMap = this.positionsMap;
    const positionSymbols = Object.keys(positionsMap);

    let totalPnl = 0;
    for (let symbol of positionSymbols) {
      totalPnl += this.calculatePositionPnl(symbol);
    }

    return totalPnl;
  }

  // auto update cache by ws-connection-event
  public startSelfUpdateCache() {
    this.wsConnMarketDataStream.on("message", (msg: any) => {
      this.tickUpdateCache(msg);
    });
  }

  protected tickUpdateCache(msg: any) {
    const msgString = msg.toString();
    const streamMsgParsed: TSymbolPricesStream = JSON.parse(msgString);
    if (streamMsgParsed.stream === "!markPrice@arr") {
      const symbolMarketPricesWs = streamMsgParsed.data;
      for (const symbolPrice of symbolMarketPricesWs) {
        const symbol = symbolPrice.s;
        const newMarketPrice = symbolPrice.p;
        this.updateSymbolCurrentMarketPrice(symbol, newMarketPrice);
      }
    }
    if (streamMsgParsed.stream === "!ticker@arr") {
      const symbolTickerPricesWs = streamMsgParsed.data;
      for (const symbolPrice of symbolTickerPricesWs) {
        const symbol = symbolPrice.s;
        const newTickerPrice = symbolPrice.c;
        this.updateSymbolCurrentTickerPrice(symbol, newTickerPrice);
      }
    }
  }

  public stopSelfUpdateCache() {
    this.wsConnMarketDataStream.close();
  }
}
