/* eslint-disable no-var */

// global augmentation (same behavior and limit like module augmentation)
// add declaration to global scope
import { TWsServer } from "./socket";
import { TSymbolsPrice } from "./symbol-price";

declare global {
  var wsServerGlob: TWsServer;
  var symbolsPrice: TSymbolsPrice;
}
export {};
