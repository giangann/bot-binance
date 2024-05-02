import { createContext } from "react";
import { ISymbolMarketPriceAPI } from "../shared/types/symbol-mark-price";
import { ISymbolTickerPriceAPI } from "../shared/types/symbol-ticker-price";

export type TCoinContext = {
  coin: {
    testnet: ISymbolMarketPriceAPI & ISymbolTickerPriceAPI;
  };
};

const data: TCoinContext = {
  coin: {
    testnet: {
      markPrice: "44",
      time: 444,
      price: "9595",
      symbol: "BTCUSDT",
    },
  },
};
export const CoinContext = createContext({});

// same data type
// for 2 different table

// table 1: testnet
// table 2: future

// same staticstic:
// symbol, price, markPrice, price1AM, markPrice1Am, percentPrice, percentMarkPrice

// make it simple
// have check box just display 5% percent change coin

// data return have this format:
// api1: query from database coin_price_1am (symbol, price, markPrice)[]
// api2: query from database coin_price_1am_future (symbol, price, markPrice)[]
// api3: query from api testnet : (symbol, price)[] and (symbol, markPrice)[]
// api4: query from api future: (symbol, price)[] and (symbol, markPrice)[]

// ws1: <testnet> maintain connection, message: {event:'ticker24h'|'markPrice", data:(symbol, price|markPrice)[]}
// ws2: <future> same with ws1 about format

// future and testnet have same data just different in endpoint

// OPT 1: has finished
// defined same fields
// call 2 endpoint, share in data like <data:{testnet: TData, future: TData}>
// <TestnetTable data = {data.testnet} fields = {fields}/>
// <FutureTable data = {data.future} fields = {fields}/>

// OPT2:
// defined fields: symbol, price, markPrice, percentPrice, percentMarkPrice, f_price, f_markPrice, f_percentPrice, f_percentMarkPrice
// call 2 endpoint, pre-process data

// ---------------WS: when update data, how  to update data--------------------------------------------------------------
// when to update data ? new message come
// how to update data
// 1. pre-handlle message: from (e,p,P,t...) to (symbol, price|markPrice)...
// 2. update base on event of message
//      with 'ticker24h' event , what need to update ?
//      with 'markPrice' event , what need to update ?
// SOLUTION: loop, find by symbol and update api return data saved in state
//          mix function with memo re-calculate and re-render
//          Because order keeped by database table so when go through mix function
//          order don't be suffered

// -----------------Filter 5%-----------------------
// react: when an element of array change , what happen? re-render setState

// user story
// filter in TData[] array (percentPriceChange / percentMarkPriceChange) equal or greater than 5%
// => filter box
// sort in TData[] array ()
