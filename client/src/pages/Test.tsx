import { useEffect, useState } from "react";
import { getApi } from "../request/request";
import { ISymbolAllPriceDBRow } from "../shared/types/symbol-all-price";
import { ISymbolTickerPriceAPI } from "../shared/types/symbol-ticker-price";
import { ISymbolMarketPriceAPI } from "../shared/types/symbol-mark-price";

export const Test = () => {
  const [symbolAllPrices, setSymbolAllPrices] = useState<
    ISymbolAllPriceDBRow[]
  >([]);
  const [symbolTickerPrices, setSymbolTickerPrices] = useState<
    ISymbolTickerPriceAPI[]
  >([]);
  const [symbolMarkPrice, setSymbolMarkPrice] = useState<
    ISymbolMarketPriceAPI[]
  >([]);
  const baseUrl = "https://testnet.binancefuture.com";

  useEffect(() => {
    async function fetchSymbolAllPrices() {
      const response = await getApi<ISymbolAllPriceDBRow[]>("coin-price-1am");
      if (response.success) setSymbolAllPrices(response.data);
      console.log(response);
    }
    fetchSymbolAllPrices();
  }, []);

  useEffect(() => {
    const endPoint = "/fapi/v2/ticker/price";
    async function fetchSymbolTickerPrices() {
      const response = await fetch(`${baseUrl}${endPoint}`, { method: "GET" });
      const data: ISymbolTickerPriceAPI[] = await response.json();
      console.log(data);
      setSymbolTickerPrices(data);
    }
    fetchSymbolTickerPrices();
  }, []);

  return <></>;
};
