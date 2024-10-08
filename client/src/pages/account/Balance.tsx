// @ts-nocheck
import CachedIcon from "@mui/icons-material/Cached";
import { Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/SocketContext";
import { getApi } from "../../request/request";
import { toast } from "react-toastify";
import { TAccount } from "../../shared/types/account";
export type TUnknownObj = Record<string, string | number>;
// type TCoin = { coin: string; amount: number; price: number; total: number };
export const Balance = () => {
  const [balance, setBalance] = useState<TUnknownObj>({});
  const socket = useContext(SocketContext);

  const fetchBalance = async () => {
    const response = await getApi("my-binance/account-info");
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
    socket?.on("ws-account-info", (accInfo: TAccount) => {
      const { totalWalletBalance, availableBalance } = accInfo;
      setBalance({
        ...balance,
        totalWalletBalance,
        availableBalance,
      });
    });
    return () => {
      socket?.off("ws-account-info");
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
