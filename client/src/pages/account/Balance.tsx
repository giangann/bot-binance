import { Box, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { getApi } from "../../request/request";
import { SocketContext } from "../../context/SocketContext";

export type TUnknownObj = Record<string, string | number>;
export const Balance = () => {
  const [balance, setBalance] = useState<TUnknownObj>({});
  const socket = useContext(SocketContext);
  const fetchTotal = useCallback(async () => {
    const response = await getApi<TUnknownObj>("user/balance");
    if (response.success) setBalance(response.data);
  }, []);

  useEffect(() => {
    fetchTotal();
  }, []);

  useEffect(() => {
    socket?.on("ws-balance", (newTotal, newBtc, newUsdt) => {
      console.log(newTotal, newBtc, newUsdt);
      setBalance({
        ...balance,
        total: newTotal,
        btc: newBtc,
        usdt: newUsdt,
      });
    });
    return () => {
      socket?.off("ws-balance");
    };
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
