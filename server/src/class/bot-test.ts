import { Bot } from "./bot";
import { BotCacheTest } from "./cache-test";
import { datasetItemsToSymbolPrices } from "../helper";
import datasetService from "../services/dataset.service";
import marketOrderChainTestService from "../services/market-order-chain-test.service";
import marketOrderPieceTestService from "../services/market-order-piece-test";
import { TBotTestConfig } from "../types/bot/bot.types";
import { removeDuplicates } from "../ultils/helper";

export class BotTest extends Bot {
  protected declare botCache: BotCacheTest | null;
  constructor() {
    super();
    this.logger.debugAndLog("BOT_TEST: initialized!");
  }

  /**
   * activate
   */
  public async activate(config: TBotTestConfig) {
    // save info to db
    await marketOrderChainTestService.create(config); // not chainService, it is chainTestService
    // init cache
    await this.initCache();
    // update statistics, init intervals
    if (this.botCache) {
      this.setActiveStatus(true);
      this.botCache.startSelfUpdateCache();
      this.checkDeactiveInterval = setInterval(() => this.tickCheckDeactive(), 1000);
      this.activeInterval = setInterval(() => this.evaluateAndMakeOrder(), 1000);
      this.logger.debugAndLog("BOT_TEST: activated!");
    } else {
      throw new Error(`BOT_TEST: Bot cache is nullish, please check!`);
    }
  }

  /**
   * deactivate
   */
  public async deactivate(stop_reason: string = null) {
    // update statistics and intervals
    this.setActiveStatus(false);
    this.botCache!.stopSelfUpdateCache();
    clearInterval(this.checkDeactiveInterval ?? undefined);
    clearInterval(this.activeInterval ?? undefined); // clearInterval arg type is silly

    // update db
    await this.closeOpeningChain(this.botCache.getBotConfig().id, stop_reason);

    // remove cache
    this.botCache = null;
    this.logger.debugAndLog("BOT_TEST: deactivated!");

    // emit to client
    global.wsServerInstance.emit("bot-quit-test", "bot-test completly deactivated!");
  }

  protected async initCache() {
    const config = await marketOrderChainTestService.getOpeningChain();
    const datasets_id = config.datasets_id;
    const dataset = await datasetService.detail(datasets_id);
    const dtSetItems = dataset.dataset_items;

    if (dtSetItems.length === 0) throw new Error("BOT_TEST: dtSetItems.length === 0");

    const ableSymbols = removeDuplicates(dtSetItems.map((item) => item.symbol));
    const mockPrices = datasetItemsToSymbolPrices(dtSetItems);

    this.botCache = new BotCacheTest(mockPrices[0], mockPrices[0], [], [], config, ableSymbols, dtSetItems);
    this.logger.debugAndLog("BOT_TEST: cache initialzed !");
  }

  protected async evaluateAndMakeOrder() {
    try {
      const orderInfos = this.genOrderInfo();

      for (const orderInfo of orderInfos) {
        const { arbitraryId, symbol, side, quantity } = orderInfo;
        this.botCache!.updateOrderInfoMap(orderInfo);
        this.createMarketOrder(symbol, side, quantity, arbitraryId);
      }
    } catch (error) {
      this.logger.saveError(error);
    }
  }

  private createMarketOrder(symbol: string, side: "BUY" | "SELL", quantity: number, id: string) {
    this.logger.debugAndLog(`BOT_TEST: NEW-ORDER: ${id} - ${side} ${quantity} ${symbol}`);
    // update cache
    // 1. orderPieces
    const orderInfo = this.botCache!.getOrderInfo(id);
    if (!orderInfo) throw new Error(`[ERROR] BOT_TEST: Order Id ${id} of symbol ${symbol}: Order Info not found!`);
    this.botCache!.updateOrderPiecesOfSymbol(symbol, orderInfo);
    // 2. position
    this.botCache!.updateSymbolPositionAmt(symbol, side === "BUY" ? quantity : -quantity);
    // 3. save to db
    const newPieceTestParams = {
      direction: orderInfo.side,
      id,
      market_order_chains_test_id: this.botCache.getBotConfig().id,
      percent_change: orderInfo.percentChange,
      price: orderInfo.price,
      symbol: orderInfo.symbol,
      quantity: orderInfo.quantity.toString(),
      transaction_size: (orderInfo.quantity * parseFloat(orderInfo.price)).toString(),
      reason: orderInfo.reason,
      total_balance: "0",
    };
    // 4. Reset pnlManging if order is TAKE_PRFT order
    if (orderInfo.isTakePrft === true) {
      this.botCache.updateSymbolPnlManaging(symbol, "is_max_pnl_start_reached", false);
      this.botCache.updateSymbolPnlManaging(symbol, "max_pnl_start", this.botCache.getBotConfig().symbol_max_pnl_start);
    }
    marketOrderPieceTestService.create(newPieceTestParams);
    // 5. Emit to client
    global.wsServerInstance.emit("new-order-placed-test", newPieceTestParams);
  }

  protected async closeOpeningChain(id: number, stop_reason: string = null) {
    await marketOrderChainTestService.update({ id, stop_reason, status: "closed" });
  }

  async tickCheckDeactive() {
    try {
      // get and process config data
      const botConfig = this.botCache!.getBotConfig();
      const { pnl_to_stop, max_pnl_start, max_pnl_threshold_to_quit, is_max_pnl_start_reached } = botConfig;
      const totalUnrlPnl = this.botCache.calculateTotalPnl();
      const stopUnrlPnl = parseFloat(pnl_to_stop);

      // take profit process
      let isAbleTakeProfit: boolean = false;
      let isAbleCutLoss: boolean = false;

      if (totalUnrlPnl > parseFloat(max_pnl_start)) {
        this.botCache.updateBotConfig("max_pnl_start", totalUnrlPnl.toFixed(2));
        if (!is_max_pnl_start_reached) {
          this.botCache.updateBotConfig("is_max_pnl_start_reached", true);
          // other logger
          this.logger.debugAndLog(`BOT_TEST: max_pnl_start is reached, now TOTAL_UNRL_PNL = ${totalUnrlPnl} MAX_PNL_START = ${max_pnl_start}`);
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
        this.logger.debugAndLog(`BOT_TEST: should deactivate, REASON: ${reason}`);
      }

      // check is completely loop through mockPrices or not
      if (this.botCache.isIndexOutsidePricesArray()) this.deactivate("End of dataset_items");
    } catch (error) {
      this.logger.saveError(error);
    }
  }
}
