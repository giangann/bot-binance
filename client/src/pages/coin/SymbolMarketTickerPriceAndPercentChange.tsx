import { Box, Checkbox, Stack, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useContext, useEffect, useMemo, useState } from "react";
import { CustomTable, StrictField } from "../../components/Table/Customtable";
import { SocketContext } from "../../context/SocketContext";
import { getApi } from "../../request/request";
import { TBinanceMarkPriceStreamToWs } from "../../shared/types/socket";
import { ISymbolAllPriceDBRow } from "../../shared/types/symbol-all-price";
import { ISymbolMarketPriceAPI } from "../../shared/types/symbol-mark-price";
import { ISymbolTickerPriceAPI } from "../../shared/types/symbol-ticker-price";
import {
  TData,
  filterDataTable,
  mix,
  newMarkPrices,
  newTickerPrices,
  sortDataTableSingleKey,
} from "../../ultils/helper";

// TABLE 2: (testnet future api)
// symbol
// price_1AM
// mark_price_1AM
// price
// mark_price
// price_percent_change
// mark_price_percent_change

type Props = {
  title: string;
  baseUrl: string;
  connection: string;
};
export const SymbolMarketTickerPriceAndPercentChange: React.FC<Props> = ({
  title,
  baseUrl,
  connection,
}) => {
  // testnet table
  const [symbolAllPrices, setSymbolAllPrices] = useState<
    ISymbolAllPriceDBRow[]
  >([]);
  const [symbolTickerPrices, setSymbolTickerPrices] = useState<
    ISymbolTickerPriceAPI[]
  >([]);
  const [symbolMarkPrices, setSymbolMarkPrice] = useState<
    ISymbolMarketPriceAPI[]
  >([]);

  const [filterBy, setFilterBy] = useState<
    (keyof Pick<TData, "percentMarkPriceChange" | "percentPriceChange">)[]
  >([]);
  const [sortBy, setSortBy] = useState<string>(
    JSON.stringify(["percentPriceChange", "percentMarkPriceChange"])
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy((event.target as HTMLInputElement).value);
  };

  const socket = useContext(SocketContext);
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

  // websocket
  useEffect(() => {
    socket?.on(connection, (msg: TBinanceMarkPriceStreamToWs) => {
      console.log("symbolMarkPrices", symbolMarkPrices);

      if (msg.event === "!markPrice@arr")
        if (symbolMarkPrices.length > 0)
          setSymbolMarkPrice(newMarkPrices(msg.data, symbolMarkPrices));
      if (msg.event === "!ticker@arr")
        if (symbolTickerPrices.length > 0)
          setSymbolTickerPrices(newTickerPrices(msg.data, symbolTickerPrices));
    });

    return () => {
      socket?.off(connection);
    };
  }, [symbolMarkPrices, symbolTickerPrices]);

  const dataTable: TData[] = useMemo(
    () => mix(symbolAllPrices, symbolTickerPrices, symbolMarkPrices),
    [symbolAllPrices, symbolTickerPrices, symbolMarkPrices]
  );

  const dataTableFilterd = filterDataTable(filterBy, dataTable);
  const sortTable = sortDataTableSingleKey(
    JSON.parse(sortBy) as (keyof Pick<
      TData,
      "percentMarkPriceChange" | "percentPriceChange"
    >)[],
    dataTableFilterd
  );
  const fields: StrictField<TData>[] = [
    {
      fieldKey: "symbol",
      header: "Symbol",
      width: 300,
    },
    {
      fieldKey: "price_1AM",
      header: "Ticker price 1AM",
      width: 300,
    },
    {
      fieldKey: "price",
      header: "Ticker price now",
      width: 300,

      render: ({ price }) => {
        return (
          <Box>
            <Typography fontWeight={600}>{price}</Typography>
          </Box>
        );
      },
    },
    {
      fieldKey: "percentPriceChange",
      header: "Ticker price change",
      width: 300,

      render: ({ percentPriceChange }) => {
        let percentText: string = "";
        let prefix: string = "";
        let color: string = "";
        if (percentPriceChange === undefined) percentText = "---";
        if (percentPriceChange !== undefined) {
          if (percentPriceChange > 0) {
            color = "green";
            prefix = "+";
          }
          if (percentPriceChange < 0) {
            color = "red";
          }
          percentText = prefix + percentPriceChange.toFixed(2);
        }
        return <Typography color={color}>{percentText}%</Typography>;
      },
    },
    {
      fieldKey: "mark_price_1AM",
      header: "Market price 1AM",
      width: 300,
    },
    {
      fieldKey: "mark_price",
      header: "Market price",
      width: 300,

      render: ({ mark_price }) => {
        return <Typography fontWeight={600}>{mark_price}</Typography>;
      },
    },
    {
      fieldKey: "percentMarkPriceChange",
      header: "Market price change",
      width: 300,

      render: ({ percentMarkPriceChange }) => {
        let percentText: string = "";
        let prefix: string = "";
        let color: string = "";
        if (percentMarkPriceChange === undefined) percentText = "---";
        if (percentMarkPriceChange !== undefined) {
          if (percentMarkPriceChange > 0) {
            color = "green";
            prefix = "+";
          }
          if (percentMarkPriceChange < 0) {
            color = "red";
          }
          percentText = prefix + percentMarkPriceChange.toFixed(2);
        }
        return <Typography color={color}>{percentText}%</Typography>;
      },
    },
  ];

  return (
    <Box>
      <Typography fontSize={22} fontWeight={600}>
        {title}
      </Typography>
      <Stack spacing={2} direction="row" alignItems={"center"}>
        {/* filter */}
        <Stack direction={"row"} alignItems={"center"}>
          <Checkbox
            checked={filterBy.includes("percentPriceChange")}
            onChange={() => {
              if (filterBy.includes("percentPriceChange")) {
                setFilterBy(
                  filterBy.filter((key) => key !== "percentPriceChange")
                );
              } else {
                setFilterBy([...filterBy, "percentPriceChange"]);
              }
            }}
          />
          <Typography>{"Ticker >= 5%"}</Typography>
        </Stack>
        <Stack direction={"row"} alignItems={"center"}>
          <Checkbox
            checked={filterBy.includes("percentMarkPriceChange")}
            onChange={() => {
              if (filterBy.includes("percentMarkPriceChange")) {
                setFilterBy(
                  filterBy.filter((key) => key !== "percentMarkPriceChange")
                );
              } else {
                setFilterBy([...filterBy, "percentMarkPriceChange"]);
              }
            }}
          />
          <Typography>{"Market >= 5%"}</Typography>
        </Stack>

        {/* sort */}
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">Sắp xếp</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={sortBy}
            onChange={handleChange}
          >
            <FormControlLabel
              value={JSON.stringify([
                "percentPriceChange",
                "percentMarkPriceChange",
              ])}
              control={<Radio />}
              label="Ticker"
            />
            <FormControlLabel
              value={JSON.stringify([
                "percentMarkPriceChange",
                "percentPriceChange",
              ])}
              control={<Radio />}
              label="Market"
            />
          </RadioGroup>
        </FormControl>
      </Stack>
      <CustomTable data={sortTable} fields={fields} />
    </Box>
  );
};
