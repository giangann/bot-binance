import { TSymbolTickerPriceWs } from "../types/websocket";

export const mockWebSocketMessage1: TSymbolTickerPriceWs[] = [
  {
    e: "24hrTicker",
    E: Date.now(),
    s: "BTCUSDT",
    p: "1.01",
    P: "1.01",
    w: "64500",
    c: "64858.261", // >1% greater
    Q: "0",
    o: "64000",
    h: "65000",
    l: "63000",
    v: "1000",
    q: "1000",
    O: Date.now() - 1000,
    C: Date.now(),
    F: 1,
    L: 100,
    n: 100,
  },
  {
    e: "24hrTicker",
    E: Date.now(),
    s: "ETHUSDT",
    p: "5.01",
    P: "5.01",
    w: "3500",
    c: "3517.50", // >5% greater
    Q: "0",
    o: "3200",
    h: "3550",
    l: "3100",
    v: "500",
    q: "500",
    O: Date.now() - 1000,
    C: Date.now(),
    F: 1,
    L: 100,
    n: 100,
  },
  {
    e: "24hrTicker",
    E: Date.now(),
    s: "BCHUSDT",
    p: "-9.02",
    P: "-2.55",
    w: "344",
    c: "345.23", // <2.5% less
    Q: "0",
    o: "340",
    h: "355",
    l: "330",
    v: "200",
    q: "200",
    O: Date.now() - 1000,
    C: Date.now(),
    F: 1,
    L: 100,
    n: 100,
  },
  {
    e: "24hrTicker",
    E: Date.now(),
    s: "XRPUSDT",
    p: "0.01",
    P: "0.01",
    w: "0.581",
    c: "0.5863", // Other choice
    Q: "0",
    o: "0.570",
    h: "0.595",
    l: "0.565",
    v: "1000",
    q: "1000",
    O: Date.now() - 1000,
    C: Date.now(),
    F: 1,
    L: 100,
    n: 100,
  },
  {
    e: "24hrTicker",
    E: Date.now(),
    s: "EOSUSDT",
    p: "0",
    P: "0",
    w: "0.615",
    c: "0.615", // Other choice
    Q: "0",
    o: "0.610",
    h: "0.620",
    l: "0.605",
    v: "200",
    q: "200",
    O: Date.now() - 1000,
    C: Date.now(),
    F: 1,
    L: 100,
    n: 100,
  },
  {
    e: "24hrTicker",
    E: Date.now(),
    s: "LTCUSDT",
    p: "-1.65",
    P: "-2.5",
    w: "64.5",
    c: "64.46", // <2.5% less
    Q: "0",
    o: "63.00",
    h: "66.00",
    l: "62.00",
    v: "300",
    q: "300",
    O: Date.now() - 1000,
    C: Date.now(),
    F: 1,
    L: 100,
    n: 100,
  },
  {
    e: "24hrTicker",
    E: Date.now(),
    s: "TRXUSDT",
    p: "0.00125",
    P: "1.00",
    w: "0.126",
    c: "0.12667", // >1% greater
    Q: "0",
    o: "0.124",
    h: "0.128",
    l: "0.122",
    v: "800",
    q: "800",
    O: Date.now() - 1000,
    C: Date.now(),
    F: 1,
    L: 100,
    n: 100,
  },
  {
    e: "24hrTicker",
    E: Date.now(),
    s: "ETCUSDT",
    p: "-1.12",
    P: "-5.01",
    w: "21.5",
    c: "21.25", // >5% less
    Q: "0",
    o: "22.00",
    h: "23.00",
    l: "20.00",
    v: "500",
    q: "500",
    O: Date.now() - 1000,
    C: Date.now(),
    F: 1,
    L: 100,
    n: 100,
  },
  {
    e: "24hrTicker",
    E: Date.now(),
    s: "LINKUSDT",
    p: "-1.37",
    P: "-10.00",
    w: "12.5",
    c: "12.333", // <2.5% less
    Q: "0",
    o: "13.00",
    h: "14.00",
    l: "11.00",
    v: "300",
    q: "300",
    O: Date.now() - 1000,
    C: Date.now(),
    F: 1,
    L: 100,
    n: 100,
  },
];