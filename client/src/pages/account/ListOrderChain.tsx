import { Box, Grid, Stack, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BotContext } from "../../context/BotContext";
import { SocketContext } from "../../context/SocketContext";
import { getApi } from "../../request/request";
import {
  TMarketOrderChainWithPiecesPagi
} from "../../shared/types/order";
import { Balance } from "./Balance";
import { NewOrderChain } from "./NewOrderChain";
import { OrderChains } from "./OrderChains";
import { Position } from "./Position";

export const ListOrderChain = () => {
  const [orderChains, setOrderChains] = useState<
    TMarketOrderChainWithPiecesPagi[]
  >([]);
  const socket = useContext(SocketContext);
  const bot = useContext(BotContext);
  const fetchOrderChains = useCallback(async () => {
    const response = await getApi<TMarketOrderChainWithPiecesPagi[]>(
      "order-chain"
    );
    if (response.success) setOrderChains(response.data);
  }, []);

  useEffect(() => {
    fetchOrderChains();
  }, []);

  useEffect(() => {
    socket?.on(
      "bot-tick",
      (
        nums_of_order: number,
        num_of_success_order: number,
        num_of_error_order: number
      ) => {
        const infoMsg = `Có ${nums_of_order} lệnh được đặt`;
        const successMsg = `Có ${num_of_success_order} lệnh thành công`;
        const errorMsg = `Có ${num_of_error_order} lệnh thất bại`;
        toast.info(infoMsg);
        toast.success(successMsg);
        toast.error(errorMsg);

        fetchOrderChains();
      }
    );
    return () => {
      socket?.off("bot-tick");
    };
  }, []);

  useEffect(() => {
    socket?.on("order-err", (errMsg: string) => {
      toast.warning(errMsg);
    });
    return () => {
      socket?.off("order-err");
    };
  }, []);

  useEffect(() => {
    socket?.on("bot-quit", (msg) => {
      toast.info(msg);
      bot.onToggle(false);
      fetchOrderChains();
    });
    return () => {
      socket?.off("bot-quit");
    };
  }, []);
  return (
    <Box>
      <BalanceAndPosition />
      <TitleAndNewChainBtn />
      <OrderChains orderChains={orderChains} />
    </Box>
  );
};

const BalanceAndPosition = () => {
  return (
    <Grid container columnSpacing={2}>
      <Grid xs={12} sm={4}>
        <Balance />
      </Grid>
      <Grid xs={12} sm={8}>
        <Position />
      </Grid>
    </Grid>
  );
};

const TitleAndNewChainBtn = () => {
  return (
    <Stack direction={"row"} spacing={2} my={2}>
      <Typography variant="h5">BOT - danh sách hoạt động</Typography>
      <NewOrderChain />
    </Stack>
  );
};

