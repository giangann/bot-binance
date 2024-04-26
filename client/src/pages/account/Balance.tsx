// @ts-nocheck
import CachedIcon from "@mui/icons-material/Cached";
import { Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/SocketContext";
import { getApi } from "../../request/request";
import { toast } from "react-toastify";
export type TUnknownObj = Record<string, string | number>;
// type TCoin = { coin: string; amount: number; price: number; total: number };
export const Balance = () => {
  const [balance, setBalance] = useState<TUnknownObj>({});
  const socket = useContext(SocketContext);

  const fetchBalance = async () => {
    const response = await getApi("user/acc-info-axios");
    if (response.success) {
      const { totalWalletBalance, availableBalance } = response.data;
      setBalance({
        ...balance,
        totalWalletBalance,
        availableBalance,
      });
    } else toast.error(response.error.message);
  };

  useEffect(() => {
    socket?.on("ws-balance", (totalWalletBalance, availableBalance) => {
      console.log("balance info", totalWalletBalance, availableBalance);
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
      <Stack direction="row" alignItems={"center"}>
        <Typography variant="h6">Your balance</Typography>
        <IconButton onClick={fetchBalance}>
          <CachedIcon />
        </IconButton>
      </Stack>
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
