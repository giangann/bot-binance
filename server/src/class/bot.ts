import { v4 as uuidv4 } from "uuid";
import { BOT_RUN_INTERVAL, IS_LIMIT_SYMBOL } from "../constants/constant";
import { numOfBuyOrders, numOfSellOrders } from "../helper";
import { IAutoActiveConfigRecordWithoutId } from "../interfaces/auto-active-config.interface";
import { Logger } from "../logger";
import { LIMIT_SYMBOLS } from "../mock";
import autoActiveConfigService from "../services/auto-active-config.service";
import CoinService from "../services/coin-price-1am.service";
import marketOrderChainService from "../services/market-order-chain.service";
import marketOrderPieceService from "../services/market-order-piece.service";
import { MyBinanceService } from "../services/my-binance.service";
import { TOrderInfo, TSymbolPrice } from "../type";
import { TBotConfig } from "../types/bot/bot.types";
import { TPosition } from "../types/rest-api/position.type";
import {
  currentMarketPriceKlineFromArray,
  isBinanceError,
  isInErrorCodeToRemove,
  maxMarketPriceKlineFromArray,
  validateAmount,
} from "../ultils/helper";
import { BotCache } from "./cache";
export class Bot {
  private isActive: boolean;
  protected activeInterval: NodeJS.Timeout | null;
  protected checkDeactiveInterval: NodeJS.Timeout | null;
  private isAbleToStop: boolean;
  protected logger: Logger;
  protected botCache: BotCache | null;
  private binanceService: MyBinanceService;
  protected coinService: CoinService;
  private isAutoActiveOn: boolean;
  private autoActiveConfig: IAutoActiveConfigRecordWithoutId | null;
  private autoActiveInterval: NodeJS.Timeout | null;

  constructor() {
    this.logger = new Logger();
    this.binanceService = new MyBinanceService();
    this.coinService = new CoinService();
    this.isActive = false;
    this.isAutoActiveOn = false;
    this.isAbleToStop = false;
    this.activeInterval = null;
    this.checkDeactiveInterval = null;
    this.autoActiveInterval = null;

    this.logger.debugAndLog("BOT: initialized! --you may see this message twices it mean both TEST and PROD successfully intialized");
  }

  public getActiveStatus() {
    return this.isActive;
  }

  protected setActiveStatus(isActive: boolean) {
    this.isActive = isActive;
  }

  protected async getSymbolPricesStart(): Promise<TSymbolPrice[]> {
    const symbolPrices = await this.coinService.list();
    const symbolPricesAfterMap: TSymbolPrice[] = symbolPrices.map((price) => ({
      symbol: price.symbol,
      tickerPrice: price.price,
      marketPrice: price.mark_price,
    }));

    return symbolPricesAfterMap;
  }

  protected async initCache() {
    const symbolStartPrices = await this.getSymbolPricesStart();
    const symbolCurrentPrices = await this.binanceService.getSymbolPrices();
    const positions = await this.binanceService.getPositions();
    const exchangeInfo = await this.binanceService.getExchangeInfo();
    const config = await marketOrderChainService.getOpeningChain();

    if (!config) throw Error(`BOT_PROD: config not found, bot cannot activate`);
    const ableSymbols = IS_LIMIT_SYMBOL ? LIMIT_SYMBOLS : symbolStartPrices.map((symPri) => symPri.symbol); // limit symbol when test in testnet

    this.botCache = new BotCache(symbolStartPrices, symbolCurrentPrices, positions, exchangeInfo.symbols, config, ableSymbols);
    this.logger.debugAndLog("BOT_PROD: cache initialzed !");
  }

  /**
   * activate
   */
  public async activate(config: TBotConfig) {
    const isActivating = this.getActiveStatus();
    if (isActivating) throw new Error("[ERROR] BOT_PROD: bot now is activating!");

    // update active status
    this.setActiveStatus(true);

    // create new chain by config params
    await marketOrderChainService.create(config);

    // wait cache init completee
    await this.initCache();

    // check botCache null or not
    if (!this.botCache) {
      throw new Error(`[ERROR] BOT_PROD: Bot cache is nullish, please check!`);
    }

    // update self statistic and intervals
    this.botCache.startSelfUpdateCache();
    this.activeInterval = setInterval(() => this.evaluateAndMakeOrder(), BOT_RUN_INTERVAL);
    this.checkDeactiveInterval = setInterval(() => this.tickCheckDeactive(), 1000);

    // logger
    this.logger.debugAndLog("BOT_PROD: activated!");

    // update active status
    this.setActiveStatus(true);
  }
  /**
   * deactivate
   */
  public async deactivate(stop_reason: string = null) {
    // check botCache nullish or not
    if (!this.botCache) {
      throw new Error(`[ERROR] BOT_PROD: Bot cache is nullish, please check!`);
    }
    // update statistics and intervals
    this.botCache.stopSelfUpdateCache();
    clearInterval(this.checkDeactiveInterval ?? undefined);
    clearInterval(this.activeInterval ?? undefined); // clearInterval arg type is silly

    // update db
    await this.closeOpeningChain(this.botCache.getBotConfig().id, stop_reason);

    // close all positions
    const closeResults = await this.binanceService.closeAllPositions();
    this.logger.debugAndLog(`BOT_PROD: Close_Positions - success: ${closeResults.success} ; failure: ${closeResults.failure}`);

    // remove cache
    this.botCache = null;
    this.logger.debugAndLog("BOT_PROD: deactivated!");

    // emit to client
    global.wsServerInstance.emit("bot-quit", "bot completly deactivated!");

    // update active status
    this.setActiveStatus(false);
  }

  protected async tickCheckDeactive() {
    try {
      // BEFORE START_REQUEST, if create_order request is not yet done => cancel
      if (!this.isAbleToStop) return;

      // call rest api get positions
      const positions = await this.binanceService.getPositions();
      // side effiect: emit to client
      global.wsServerInstance.emit("ws-position-info", positions);

      // AFTER RECEIVED_RESPONSE, if create_order request not yet done => cancel
      if (!this.isAbleToStop) return;

      // check botCache null or not
      if (!this.botCache) {
        throw new Error(`[ERROR] BOT_PROD: Bot cache is nullish, please check!`);
      }

      // side effect update positionsMap cache for other calculation
      this.botCache.updatePositionsMap(positions);

      // get and process config data
      const botConfig = this.botCache!.getBotConfig();
      const { pnl_to_stop, max_pnl_start, max_pnl_threshold_to_quit, is_max_pnl_start_reached } = botConfig;
      const totalUnrlPnl = this.calculateUnrlPnl(positions);
      const stopUnrlPnl = parseFloat(pnl_to_stop);

      // take profit process
      let isAbleTakeProfit: boolean = false;
      let isAbleCutLoss: boolean = false;

      if (totalUnrlPnl > parseFloat(max_pnl_start)) {
        this.botCache.updateBotConfig("max_pnl_start", totalUnrlPnl.toFixed(2));
        if (!is_max_pnl_start_reached) {
          this.botCache.updateBotConfig("is_max_pnl_start_reached", true);
          // other logger
          this.logger.debugAndLog(`BOT_PROD: max_pnl_start is reached, now TOTAL_UNRL_PNL = ${totalUnrlPnl} MAX_PNL_START = ${max_pnl_start}`);
        }
      }
      if (is_max_pnl_start_reached) {
        if (totalUnrlPnl < parseFloat(max_pnl_threshold_to_quit) * parseFloat(max_pnl_start)) isAbleTakeProfit = true;
      }

      // process when need cutloss
      if (totalUnrlPnl < stopUnrlPnl) isAbleCutLoss = true;

      // logger debug
      this.logger.log(`TOTAL_UNRL_PNL: ${totalUnrlPnl}`);

      // condition reach => deactivate
      let reason = "";
      const shouldDeactivate = isAbleCutLoss || isAbleTakeProfit;
      if (shouldDeactivate) {
        if (isAbleCutLoss) {
          reason = `CUT_LOSS.. ${totalUnrlPnl} < ${stopUnrlPnl}`;
        }
        if (isAbleTakeProfit) {
          reason = `TAKE_PRFT.. ${totalUnrlPnl.toFixed(2)} < ${max_pnl_start} x ${max_pnl_threshold_to_quit}`;
        }

        this.deactivate(reason);

        // logger
        this.logger.debugAndLog(`BOT_PROD: should deactivate, REASON: ${reason}`);
      }
    } catch (error) {
      this.logger.saveError(error);
    }
  }

  protected calculateUnrlPnl(positions: TPosition[]) {
    let result = 0;
    for (const position of positions) {
      result += parseFloat(position.unRealizedProfit);
    }
    return result;
  }

  private async updatePositionsMapCache() {
    // AFTER create_order response received, fetch positions and update cache
    const positions = await this.binanceService.getPositions();
    this.botCache?.updatePositionsMap(positions);

    // side effect: forward to client
    global.wsServerInstance.emit("ws-position-info", positions);
  }

  protected async evaluateAndMakeOrder() {
    try {
      // skip if dont have cache
      if (!this.botCache) {
        this.logger.saveError(Error(`BOT_PROD: cache is nullish, please check!`));
        return;
      }

      // gen params to place order
      const orderInfos = this.genOrderInfo();
      if (orderInfos.length === 0) return;

      // constrain limit to avoid too many orders error
      const limitNumberOfOrders = 100;
      const trimOrderInfos = [...orderInfos.slice(0, limitNumberOfOrders)];

      // update orderInfo for x2 cutloss/take_prft order
      const cutlossOrTakePrftOrders = trimOrderInfos.filter((orderInfo) => orderInfo.isTakePrft === true || orderInfo.isCutloss === true);
      const cutlossOrTakePrftOrdersWithNewArbitraryId = cutlossOrTakePrftOrders.map((order) => ({ ...order, arbitraryId: uuidv4() }));
      const newOrderInfos = [...trimOrderInfos, ...cutlossOrTakePrftOrdersWithNewArbitraryId];

      // update cache
      for (const orderInfo of newOrderInfos) {
        this.botCache.updateOrderInfoMap(orderInfo);
      }

      // make order
      const newOrderPromises = newOrderInfos.map(({ symbol, side, quantity, arbitraryId }) =>
        this.binanceService.createMarketOrder(symbol, side, quantity, arbitraryId)
      );

      // START create_order request - lock don't allow deactivate
      this.isAbleToStop = false;
      const startTime = Date.now();
      const newOrderResponses = await Promise.all(newOrderPromises);

      // AFTER create_order response received
      // debug time to receive response
      const responseTime = Date.now() - startTime;
      this.logger.debugAndLog(`BOT_PROD: waited for response ${responseTime} ms`);

      // unlock allow deactivate
      this.isAbleToStop = true;

      // check cache again
      if (!this.botCache) {
        this.logger.saveError(Error(`BOT_PROD: cache is nullish, please check!`));
        return;
      }

      // update positionsMap cache
      this.updatePositionsMapCache();

      // handle response
      for (const response of newOrderResponses) {
        try {
          if (!response) continue;

          const id = response.clientOrderId;
          const orderInfo = this.botCache.getOrderInfo(id);
          if (!orderInfo) {
            throw new Error(`BOT_PROD: OrderInfo not found in cache, id= ${id} ${JSON.stringify(orderInfo)}`);
          }
          const { side: direction, quantity, symbol, price, percentChange, reason } = orderInfo;

          // handle success or error
          if (isBinanceError(response)) {
            // error: remove from able symbols, log
            const { code, msg } = response;

            this.logger.debugAndLog(`BOT_PROD: [ERROR] ${direction} ${quantity} ${symbol} - ${code} ${msg}`);
            if (isInErrorCodeToRemove(code) && this.botCache.isSymbolPositionAmtZero(symbol)) {
              this.botCache.removeAbleSymbol(symbol);
              const remainNumOfAbleSymbols = this.botCache.getAbleSymbols().length;
              this.logger.debugAndLog(`BOT_PROD: Removed ${symbol} from able symbol, remain ${remainNumOfAbleSymbols} symbol`);
            }
          } else {
            // success
            // logger
            this.logger.debugAndLog(`BOT_PROD: NEW-ORDER: ${id} - ${direction} ${quantity} ${symbol}`);
            // 1. Save to cache
            this.botCache.updateOrderPiecesOfSymbol(symbol, orderInfo);
            // 2. Update database
            const { id: market_order_chains_id } = this.botCache.getBotConfig();
            const pieceParams = {
              id,
              market_order_chains_id,
              direction,
              quantity: quantity.toString(),
              symbol,
              price,
              percent_change: percentChange,
              total_balance: "0.00",
              transaction_size: (quantity * parseFloat(price)).toString(),
              reason: reason,
            };
            marketOrderPieceService.create(pieceParams);
            // 3. Reset pnlManging if order is TAKE_PRFT order
            if (orderInfo.isTakePrft === true) {
              this.botCache.updateSymbolPnlManaging(symbol, "is_max_pnl_start_reached", false);
              this.botCache.updateSymbolPnlManaging(symbol, "max_pnl_start", this.botCache.getBotConfig().symbol_max_pnl_start);
            }
            // 4. Emit to client
            global.wsServerInstance.emit("new-order-placed", pieceParams);
          }
        } catch (error) {
          this.logger.saveError(error);
        }
      }
    } catch (error) {
      this.logger.saveError(error);
    }
  }

  protected genOrderInfo(): TOrderInfo[] {
    if (!this.botCache) {
      return [];
    }
    const orderInfos: TOrderInfo[] = [];
    const ableSymbols = this.botCache.getAbleSymbols();

    for (let symbol of ableSymbols) {
      try {
        // get cache data
        const currPrice = this.botCache.getSymbolCurrentPrice(symbol);
        if (!currPrice) continue;

        const startPrice = this.botCache.getSymbolStartPrice(symbol);
        const prevOrderPrice = this.botCache.getSymbolPrevPrice(symbol);
        const botConfig = this.botCache.getBotConfig();
        const symbolOrders = this.botCache.getOrdersOfSymbol(symbol);
        const symbolPosition = this.botCache.getSymbolPosition(symbol);
        const symbolPnlManaging = this.botCache.getSymbolPnlManaging(symbol);
        const exchangeInfoSymbolsMap = this.botCache.getExchangeInfoSymbolsMap();
        const { percent_to_buy, percent_to_first_buy, percent_to_sell, transaction_size_start } = botConfig;

        // process cache data
        const currMarketPriceNumber = parseFloat(currPrice.marketPrice as string);
        const startMarketPriceNumber = parseFloat(startPrice.marketPrice as string);
        const prevOrderPriceNumber = parseFloat(prevOrderPrice as string);
        const percentToFirstBuyNumber = parseFloat(percent_to_first_buy);
        const percentToBuyNumber = parseFloat(percent_to_buy);
        const percentToSellNumber = parseFloat(percent_to_sell);
        const transactionSizeStartNumber = transaction_size_start;
        const symbolPositionAmt = symbolPosition?.positionAmt;
        const symbolPositionAmtNumber: number = parseFloat(symbolPositionAmt as string) || 0; // (1)0 or (2)number>0
        const symbolPositionUnrlPnl = symbolPosition?.unRealizedProfit;
        const symbolPositionUnrlPnlNumber = parseFloat(symbolPositionUnrlPnl as string) || 0; // (1)0 or (2)number>0

        const symbolMaxPnlStart = symbolPnlManaging?.max_pnl_start;
        const symbolMaxPnlStartNumber = parseFloat(symbolMaxPnlStart as string); // (1)Nan or (2)number
        const isSymbolMaxPnlStartReached = symbolPnlManaging?.is_max_pnl_start_reached; // (1)undefined or (2)boolean
        const symbolMaxPnlThreshold = parseFloat(botConfig.symbol_max_pnl_threshold);
        const symbolPnlToCutlossNumber = parseFloat(botConfig.symbol_pnl_to_cutloss);

        // take-profit and cut-loss for invidual symbol
        let isSymbolAbleTakeProfit = false;
        let isSymbolAbleCutloss = false;
        let reason: string | null = null;

        if (symbolPositionUnrlPnlNumber < symbolPnlToCutlossNumber) {
          isSymbolAbleCutloss = true;
          reason = `CUT_LOSS: ${symbolPositionUnrlPnlNumber} < ${symbolPnlToCutlossNumber}`;
        }
        if (!isSymbolMaxPnlStartReached) {
          if (symbolPositionUnrlPnlNumber > symbolMaxPnlStartNumber) {
            this.botCache.updateSymbolPnlManaging(symbol, "is_max_pnl_start_reached", true);
            this.botCache.updateSymbolPnlManaging(symbol, "max_pnl_start", symbolPositionUnrlPnlNumber.toString());
          }
        }
        if (isSymbolMaxPnlStartReached) {
          if (symbolPositionUnrlPnlNumber > symbolMaxPnlStartNumber) {
            this.botCache.updateSymbolPnlManaging(symbol, "max_pnl_start", symbolPositionUnrlPnlNumber.toString());
          }
          if (symbolPositionUnrlPnlNumber < symbolMaxPnlStartNumber * symbolMaxPnlThreshold) {
            isSymbolAbleTakeProfit = true;
            reason = `TAKE_PRFT: ${symbolPositionUnrlPnlNumber} < ${symbolMaxPnlStartNumber} * ${symbolMaxPnlThreshold}`;
          }
        }

        // calculate statistics
        const numberOfBuyOrders = numOfBuyOrders(symbolOrders ?? []);
        const numberOfSellOrders = numOfSellOrders(symbolOrders ?? []);

        const prevPriceNumber = isNaN(prevOrderPriceNumber) ? startMarketPriceNumber : prevOrderPriceNumber;
        const percentChange = (currMarketPriceNumber / prevPriceNumber - 1) * 100;

        // implement logic
        // decide direction
        let direction: "BUY" | "SELL" | "" = "";
        const isAbleToSellCondition1 = numberOfBuyOrders >= 2 && percentChange <= percentToSellNumber;
        const isAbleToSellCondition2 = isSymbolAbleCutloss || isSymbolAbleTakeProfit;
        // const extraSellCondition = symbolPositionUnrlPnlNumber > 1 && numberOfBuyOrders >= 1;
        // const isAbleToSell = isAbleToSellCondition1 || isAbleToSellCondition2 || extraSellCondition;
        const isAbleToSell = isAbleToSellCondition1 || isAbleToSellCondition2;

        const isAbleToFirstBuy = percentChange >= percentToFirstBuyNumber && numberOfBuyOrders === 0;
        const isAbleToBuyMore = percentChange >= percentToBuyNumber && numberOfBuyOrders >= 1;
        const isAbleToBuyCondition1 = isAbleToFirstBuy || isAbleToBuyMore;
        // const extraBuyCondition = percentChange <= -2 && numberOfBuyOrders >= 1;
        // const isAbleToBuy = isAbleToBuyCondition1 || extraBuyCondition;
        const isAbleToBuy = isAbleToBuyCondition1;

        if (isAbleToSell) direction = "SELL";
        if (isAbleToBuy) direction = "BUY";
        // if (isAbleToBuy && extraSellCondition) direction = "SELL";
        if (direction === "") continue;

        // decide quantity
        const quantityStart: number = transactionSizeStartNumber / currMarketPriceNumber;
        let quantity = quantityStart;

        if (isAbleToSell) {
          if (!symbolPositionAmtNumber) continue;
          if (symbolPositionAmtNumber) quantity = symbolPositionAmtNumber;
        }
        if (isAbleToBuy) {
          if (isAbleToFirstBuy) {
            quantity = quantityStart;
          }
          if (isAbleToBuyMore) {
            quantity = symbolPositionAmtNumber || quantityStart; // right value in case left value == 0
          }
        }
        const precision = exchangeInfoSymbolsMap[symbol]?.quantityPrecision;
        const orderQtyValid = validateAmount(quantity, precision);

        // make add el
        const arbitraryId = uuidv4();
        orderInfos.push({
          arbitraryId: arbitraryId,
          currentQty: symbolPositionAmt as string,
          percentChange: percentChange.toString(),
          price: currMarketPriceNumber.toString(),
          reason: reason,
          isTakePrft: isSymbolAbleTakeProfit,
          isCutloss: isSymbolAbleCutloss,
          quantity: orderQtyValid,
          side: direction,
          symbol: symbol,
        });
      } catch (error) {
        this.logger.saveError(error);
      }
    }

    return orderInfos;
  }

  protected async closeOpeningChain(id: number, stop_reason: string = null) {
    await marketOrderChainService.update({ id, stop_reason, status: "closed" });
  }

  /**
   * serve controller: get auto-active status is on or not
   */
  public getAutoActiveStatus() {
    return this.isAutoActiveOn;
  }

  public async startAutoActive() {
    // throw if is auto-active is already turned on
    if (this.isAutoActiveOn === true) throw new Error("BOT_PROD: auto-active already TURNED_ON !");

    // get auto-active config from database
    const autoActiveConfig = await autoActiveConfigService.getOne();
    this.autoActiveConfig = autoActiveConfig;

    // toggle auto-active status
    this.isAutoActiveOn = true;

    // set interval to check
    this.createAutoActiveInterval();

    // logger
    this.logger.debugAndLog("BOT_PROD: auto-active now is turned on!");
  }

  /**
   * if bot is activating => autoActiveConfig may be nullish
   * if bot is deactivating => autoActiveConfig alse may be nullish
   */
  public stopAutoActive() {
    // throw if is auto-active is already turned off
    if (this.isAutoActiveOn === false) throw new Error("BOT_PROD: auto-active already TURNED_OFF !");

    // clear interval if exist
    clearInterval(this.autoActiveInterval ?? undefined);

    // update auto-active status
    this.isAutoActiveOn = false;

    // destructure autoActiveConfig
    this.autoActiveConfig = null;

    // logger
    this.logger.debugAndLog("BOT_PROD: auto-active now is turned off!");
  }

  private createAutoActiveInterval() {
    this.autoActiveInterval = setInterval(() => this.tickAutoActiveCheck(), 1000);

    // logger
    this.logger.debugAndLog("BOT_PROD: auto-active interval be setted, checking BTC prices condition!");
  }

  private async tickAutoActiveCheck() {
    console.log("check func running");
    // not allow active if bot already activating
    const isBotActivating = this.getActiveStatus();
    if (isBotActivating) return;

    try {
      // get data, calculate price
      const klines = await this.binanceService.getMarketPriceKlines();
      const maxPrice = maxMarketPriceKlineFromArray(klines);
      const currPrice = currentMarketPriceKlineFromArray(klines);

      console.log(`fetching btc prices!, max: ${maxPrice}, curr: ${currPrice}, descrease: ${currPrice - maxPrice}`);

      // emit data to client to show price change realtime
      global.wsServerInstance.emit("auto-active-check", { maxPrice, currPrice });

      // check if have config or not
      if (!this.autoActiveConfig) return;

      // decide whether or not condition reach
      const decreasePrice = maxPrice - currPrice;
      const decreasePriceToActive = this.autoActiveConfig.auto_active_decrease_price;
      const decreasePriceToActiveNumber = parseFloat(decreasePriceToActive);

      const isAbleToActive = decreasePrice >= decreasePriceToActiveNumber;

      // activate bot
      if (isAbleToActive) {
        const activeReason = `BTCUSDT market price - Now: ${currPrice}, Max: ${maxPrice}`;

        // call active method
        this.activate({ ...this.autoActiveConfig, status: "open", start_reason: activeReason, total_balance_start: "0.00", price_start: "0.00" });

        // emit to client
        global.wsServerInstance.emit("bot-active", `BOT_PROD: auto activated with reason: ${activeReason}`);

        // logger
        this.logger.debugAndLog(`BOT_PROD: auto activated with reason: ${activeReason}`);
      }
    } catch (error: any) {
      this.logger.saveError(error);
    }
  }

  public updatePnlToSop(chainId: number, pnl: string) {
    // check chain_id valid or not
    const openingChainId = this.botCache.getBotConfig().id;
    if (chainId !== openingChainId) throw new Error(`BOT_PROD: unvalid chainId = ${chainId}, botConfig chainId in cache: ${openingChainId}`);

    this.botCache.updateBotConfig("pnl_to_stop", pnl);

    // logger to guarantee
    this.logger.log(`BOT_PROD: bot config pnl_to_stop updated, new value = ${this.botCache.getBotConfig().pnl_to_stop}`);
  }
}
