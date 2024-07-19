import { TSymbolTickerPriceWs } from "../types/websocket";
import { mockWebSocketMessage1 } from "./symbol-ticker-price-ws";

/**
1. Greater than the previous price by more than 1%
2. Greater than the previous price by more than 5%
3. Less than the previous price by more than 2.5%
4. Anything not covered by the above three choices 
*/

export const symbols: string[] = [
  "BTCUSDT",
  "ETHUSDT",
  "BCHUSDT",
  "XRPUSDT",
  "EOSUSDT",
  "LTCUSDT",
  "TRXUSDT",
  "ETCUSDT",
  "LINKUSDT",
];

export function genMessageWs(
  prevMessage: TSymbolTickerPriceWs[]
): TSymbolTickerPriceWs[] {
  const message: TSymbolTickerPriceWs[] = [];

  // algorithm:
  for (let symbol of symbols) {
    const choice = randomNumber(1, 4);
    const prevSymbolPrice = prevMessage.find(
      (symbolPrice) => symbolPrice.s === symbol
    );
    const prevPrice = prevSymbolPrice.c;
    const symbolPrice: TSymbolTickerPriceWs = {
      s: symbol,
      c: priceByChoice(prevPrice, choice),

      // dont care
      e: "24hrTicker",
      E: Date.now(),
      p: "0.00",
      P: "0.00",
      w: "0.00",
      Q: "0.00",
      o: "0.00",
      h: "0.00",
      l: "0.00",
      v: "0.00",
      q: "0.00",
      O: 0,
      C: 0,
      F: 0,
      L: 0,
      n: 0,
    };

    message.push(symbolPrice);
  }

  return message;
}

export function randomNumber(start: number, end: number): number {
  if (start > end) {
    throw new Error(
      "The start number must be less than or equal to the end number."
    );
  }

  const range = end - start + 1; // Adjusted for inclusive range
  return Math.floor(Math.random() * range) + start;
}

export function priceByChoice(prevPrice: string, choiceNumber: number) {
  const prevPriceNumber = parseFloat(prevPrice);
  let percentChangeByChoice: number;

  switch (choiceNumber) {
    case 1:
      percentChangeByChoice = randomNumber(2, 10);
      break;
    case 2:
      percentChangeByChoice = randomNumber(6, 10);
      break;
    case 3:
      percentChangeByChoice = randomNumber(-10, -3);
      break;
    case 4:
      percentChangeByChoice = randomNumber(-2, 0);
      break;
    default:
      break;
  }

  const currPriceNumber = prevPriceNumber * (percentChangeByChoice / 100 + 1);
  const currPrice = currPriceNumber.toFixed(5);

  return `${choiceNumber}:` + `${prevPriceNumber.toFixed(5)}:` + currPrice;
}
