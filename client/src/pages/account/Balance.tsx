// @ts-nocheck
import { Box, Skeleton, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/SocketContext";
export type TUnknownObj = Record<string, string | number>;
// type TCoin = { coin: string; amount: number; price: number; total: number };
export const Balance = () => {
  const [balance, setBalance] = useState<TUnknownObj>({});
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket?.on("ws-balance", (totalWalletBalance, availableBalance) => {
      setBalance({
        ...balance,
        totalWalletBalance,
        availableBalance,
      });
    });
    return () => {
      socket?.off("ws-balance");
    };
  }, []);
  return (
    <Box>
      <Typography variant="h6">Your balance</Typography>
      {balance.totalWalletBalance ? (
        <>
          <Typography>
            totalWalletBalance: {balance.totalWalletBalance} $
          </Typography>
          <Typography>
            availableBalance: {balance.availableBalance} $
          </Typography>
        </>
      ) : (
        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem", width: "100px", height: "30px" }}
        />
      )}
    </Box>
  );
};
