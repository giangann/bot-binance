import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getApi } from "../../request/request";

export type TUnknownObj = Record<string, string | number>;
export const Balance = () => {
  const [balance, setBalance] = useState<TUnknownObj>({});
  useEffect(() => {
    async function fetchTotal() {
      const response = await getApi<TUnknownObj>("user/balance");
      if (response.success) setBalance(response.data);
    }
    fetchTotal();
  }, []);
  return (
    <Box>
      <Typography variant="h6">Your balance</Typography>
      {/* total, coin avaiable */}
      <Typography>Total: {balance.total} $</Typography>
      <Typography>BTC: {balance.btc}</Typography>
      <Typography>USDT: {balance.usdt}</Typography>

    </Box>
  );
};
