/* eslint-disable no-var */

// global augmentation (same behavior and limit like module augmentation)
// add declaration to global scope
import { TWsServer } from "./socket";
import { TSymbolPriceMap } from "./symbol-price";

declare global {
  var wsServerGlob: TWsServer;
  var symbolsPriceMap: TSymbolPriceMap;
  var tickInterval: null | NodeJS.Timeout;
  var totalBalancesUSDT: number;
}
export {};
