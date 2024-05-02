import { useEffect, useMemo, useState } from "react";
import { ISymbolAllPriceDBRow } from "../../shared/types/symbol-all-price";
import { ISymbolTickerPriceAPI } from "../../shared/types/symbol-ticker-price";
import { ISymbolMarketPriceAPI } from "../../shared/types/symbol-mark-price";
import { getApi } from "../../request/request";
import { TData, mix } from "../../ultils/helper";
import { CustomTable, StrictField } from "../../components/Table/Customtable";
import { Box, Typography } from "@mui/material";

// TABLE 2: (testnet future api)
// symbol
// price_1AM
// mark_price_1AM
// price
// mark_price
// price_percent_change
// mark_price_percent_change

export const CoinTestnetFuture = () => {
  // testnet table
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
  //   const baseUrl = "https://fapi.binance.com";

  useEffect(() => {
    async function fetchSymbolAllPrices() {
      const response = await getApi<ISymbolAllPriceDBRow[]>("coin-price-1am");
      if (response.success) setSymbolAllPrices(response.data);
    }
    fetchSymbolAllPrices();
  }, []);

  useEffect(() => {
    const endPoint = "/fapi/v2/ticker/price";
    async function fetchSymbolTickerPrices() {
      const response = await fetch(`${baseUrl}${endPoint}`, { method: "GET" });
      const data: ISymbolTickerPriceAPI[] = await response.json();
      setSymbolTickerPrices(data);
    }
    fetchSymbolTickerPrices();
  }, []);

  useEffect(() => {
    const endPoint = "/fapi/v1/premiumIndex";
    async function fetchSymbolMarkPrices() {
      const response = await fetch(`${baseUrl}${endPoint}`, { method: "GET" });
      const data: ISymbolMarketPriceAPI[] = await response.json();
      setSymbolMarkPrice(data);
    }
    fetchSymbolMarkPrices();
  }, []);

  const dataTable: TData[] = useMemo(
    () => mix(symbolAllPrices, symbolTickerPrices, symbolMarkPrice),
    [symbolAllPrices, symbolTickerPrices, symbolMarkPrice]
  );

  const fields: StrictField<TData>[] = [
    {
      fieldKey: "symbol",
      header: "Symbol",
    },
    {
      fieldKey: "price_1AM",
      header: "Ticker price 1AM",
    },
    {
      fieldKey: "price",
      header: "Ticker price now",
      render: ({ price_1AM, price }) => {
        let ratio = parseFloat(price) / parseFloat(price_1AM);
        let percent = (ratio - 1) * 100;

        return (
          <Box>
            <Typography fontWeight={600}>{price}</Typography>
            {percent !== 0 && (
              <Typography color={percent > 0 ? "green" : "red"}>
                {percent.toFixed(4)} %
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      fieldKey: "mark_price_1AM",
      header: "Market price 1AM",
    },
    {
      fieldKey: "mark_price",
      header: "Market price",
      render: ({ mark_price_1AM, mark_price }) => {
        let ratio = parseFloat(mark_price) / parseFloat(mark_price_1AM);
        let percent = (ratio - 1) * 100;

        return (
          <Box>
            <Typography fontWeight={600}>{mark_price}</Typography>
            {percent !== 0 && (
              <Typography color={percent > 0 ? "green" : "red"}>
                {percent.toFixed(4)} %
              </Typography>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Typography fontSize={22} fontWeight={600}>
        Coin testnet 
      </Typography>
      <CustomTable data={dataTable} fields={fields} />
    </Box>
  );
};
