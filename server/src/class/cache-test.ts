import { positionSample } from "../constants/constant";
import { datasetItemsToSymbolPrices } from "../helper";
import { IDatasetItemRecord } from "../interfaces/dataset-item.interface";
import { IMarketOrderChainRecord } from "../interfaces/market-order-chain.interface";
import { TSymbolPrice, TSymbolPrices } from "../type";
import { TExchangeInfoSymbol } from "../types/rest-api/exchange-info.type";
import { TPosition } from "../types/rest-api/position.type";
import { BotCache } from "./cache";

export class BotCacheTest extends BotCache {
  private intervalUpdate: NodeJS.Timeout | null;
  private mockPrices: TSymbolPrices[];
  private mockPricesIndex: number;

  constructor(
    symbolStartPrices: TSymbolPrice[],
    symbolCUrrentPries: TSymbolPrice[],
    positions: TPosition[],
    exchangeInfoSymbols: TExchangeInfoSymbol[],
    openingChain: IMarketOrderChainRecord,
    ableSymbols: string[],
    datasetItems: IDatasetItemRecord[]
  ) {
    super(symbolStartPrices, symbolCUrrentPries, positions, exchangeInfoSymbols, openingChain, ableSymbols);

    this.mockPricesIndex = 0;
    this.mockPrices = datasetItemsToSymbolPrices(datasetItems);
  }

  private getMockPrices = (() => {
    const resetIndex = () => {
      this.mockPricesIndex = 0;
    };

    const getPrices = () => {
      const prices = this.mockPrices[this.mockPricesIndex];
      this.mockPricesIndex++;
      return prices;
    };

    return {
      getPrices,
      resetIndex,
    };
  })();

  public updateSymbolPositionAmt(symbol: string, positionAmtAdd: number) {
    const symbolPosition = this.getSymbolPosition(symbol);
    if (!symbolPosition) {
      const newSymbolPosition: TPosition = {
        ...positionSample,
        symbol,
        positionAmt: positionAmtAdd.toString(),
        unRealizedProfit: "0",
      };
      this.positionsMap[symbol] = newSymbolPosition;
    } else {
      const { positionAmt } = symbolPosition;
      const positionAmtNumber = parseFloat(positionAmt);
      const newSymbolPositionAmtNumber = positionAmtNumber + positionAmtAdd;
      const newSymbolPositionAmt = newSymbolPositionAmtNumber.toString();
      this.positionsMap[symbol] = {
        ...symbolPosition,
        positionAmt: newSymbolPositionAmt,
      };
    }
  }

  public startSelfUpdateCache() {
    this.intervalUpdate = setInterval(() => this.tickUpdateCache(), 1000);
  }
  protected tickUpdateCache() {
    this.getAndUpdateSymbolCurrentPricesMap();
    this.updatedSymbolPositionsMapUnrlPnl();
  }

  protected getAndUpdateSymbolCurrentPricesMap() {
    const mockPrice = this.getMockPrices.getPrices();
    this.updateSymbolCurrentPricesMap(mockPrice ?? []);
  }

  protected updatedSymbolPositionsMapUnrlPnl() {
    // get all positions symbol
    const positionsMap = this.positionsMap;
    const positionSymbols = Object.keys(positionsMap);

    for (let symbol of positionSymbols) {
      const symbolPosition = this.getSymbolPosition(symbol);
      const currentSymbolPnl = this.calculatePositionPnl(symbol);

      this.positionsMap[symbol] = {
        ...symbolPosition,
        unRealizedProfit: currentSymbolPnl.toString(),
      };
    }
  }
  /**
   * stopSelfUpdateCache
   */
  public stopSelfUpdateCache() {
    this.getMockPrices.resetIndex();
    clearInterval(this?.intervalUpdate ?? undefined);
  }
  /**
   * getUpdateInterval
   */
  public getIntervalUpdate() {
    return this.intervalUpdate;
  }

  public isIndexOutsidePricesArray(): boolean {
    return this.mockPricesIndex > this.mockPrices.length;
  }
}
