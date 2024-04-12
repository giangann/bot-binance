import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CustomTable, StrictField } from "../../components/Table/Customtable";
import { getApi } from "../../request/request";

type TTrade = {
  order: string;
  symbol: string;
  datetime: string;
  price: number; //float
  amount: string; //float
};
export const TradeHistory = () => {
  const [orderHistory, setOrderHistory] = useState<TTrade[]>([]);
  const fields: StrictField<TTrade>[] = [
    {
      header: "order",
      fieldKey: "order",
      width: 300,
    },
    {
      header: "Symbol",
      fieldKey: "symbol",
      width: 300,
    },
    {
      header: "datetime",
      fieldKey: "datetime",
      render: (row) => (
        <Typography>
          {dayjs(row.datetime).format("DD/MM/YYYY HH:mm:ss")}
        </Typography>
      ),
      width: 300,
    },
    {
      header: "price",
      fieldKey: "price",
      width: 300,
    },
    {
      header: "amount",
      fieldKey: "amount",
      width: 300,
    },
  ];
  useEffect(() => {
    async function fetchOrderHistory() {
      const response = await getApi<TTrade[]>("user/trade-history");
      if (response.success) setOrderHistory(response.data);
    }
    fetchOrderHistory();
  }, []);
  return (
    <Box>
      <Typography variant="h6">Trade History</Typography>

      {/* symbol, size, amount */}
      <CustomTable fields={fields} data={orderHistory} />
    </Box>
  );
};
