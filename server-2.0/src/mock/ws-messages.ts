import { TSymbolTickerPrice } from "../types/rest-api";
import { TSymbolTickerPriceWs } from "../types/websocket";
import { genMessageWs, genMessageWsFromRest } from "./gen-message";
import { mockWebSocketMessage1 } from "./symbol-ticker-price-ws";

export const createListMessages = (symbolTickerPricesRest: TSymbolTickerPrice[]): TSymbolTickerPriceWs[][] => {

  const message1 = genMessageWsFromRest(symbolTickerPricesRest);
  const message2 = genMessageWs(message1);
  const message3 = genMessageWs(message2);
  const message4 = genMessageWs(message3);
  const message5 = genMessageWs(message4);
  const message6 = genMessageWs(message5);
  const message7 = genMessageWs(message6);
  const message8 = genMessageWs(message7);
  const message9 = genMessageWs(message8);
  const message10 = genMessageWs(message9);

  const listMessage = [
    message1,
    message2,
    message3,
    message4,
    message5,
    message6,
    message7,
    message8,
    message9,
    message10,
  ];
  
  return listMessage;
};
