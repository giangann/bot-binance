import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CustomTable, StrictField } from "../../components/Table/Customtable";
import { getApi } from "../../request/request";

type TOrder = {
  id: string;
  symbol: string;
  status: string;
  datetime: string;
  side: string;
  price: number; //float
  amount: string; //float
  average: number; //float
  filled: number; //float
  remaining: number; //float
};
export const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState<TOrder[]>([]);
  const fields: StrictField<TOrder>[] = [
    {
      header: "Id",
      fieldKey: "id",
      width: 300,
    },
    {
      header: "Symbol",
      fieldKey: "symbol",
      width: 300,
    },
    {
      header: "status",
      fieldKey: "status",
      width: 300,
    },
    {
      header: "side",
      fieldKey: "side",
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
    {
      header: "average",
      fieldKey: "average",
      width: 300,
    },
    {
      header: "filled",
      fieldKey: "filled",
      width: 300,
    },
    {
      header: "remaining",
      fieldKey: "remaining",
      width: 300,
    },
  ];
  useEffect(() => {
    async function fetchOrderHistory() {
      const response = await getApi<TOrder[]>("user/order-history");
      if (response.success) setOrderHistory(response.data);
    }
    fetchOrderHistory();
  }, []);
  return (
    <Box>
      <Typography variant="h6">Order History</Typography>

      {/* symbol, size, amount */}
      <CustomTable fields={fields} data={orderHistory} />
    </Box>
  );
};
