import { Box, Grid, Stack, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { OrderChainContext } from "../../context/OrderChainContext";
import { SocketContext } from "../../context/SocketContext";
import { getApi } from "../../request/request";
import { TMarketOrderChainWithPiecesPagi } from "../../shared/types/order";
import { Balance } from "./Balance";
import { NewOrderChain } from "./NewOrderChain";
import { OrderChains } from "./OrderChains";
import { Position } from "./Position";
import { AutoActive } from "./AutoActive";
import { BackToHomePage } from "../../components/BackHome/BackToHomePage";
import { MarkAllChainsAsClosed } from "./MarkAllChainsAsClosed";

export const ListOrderChain = () => {
  const [orderChains, setOrderChains] = useState<TMarketOrderChainWithPiecesPagi[]>([]);
  const socket = useContext(SocketContext);
  const fetchOrderChains = useCallback(async () => {
    const response = await getApi<TMarketOrderChainWithPiecesPagi[]>("order-chain");
    if (response.success) setOrderChains(response.data);
  }, []);

  useEffect(() => {
    fetchOrderChains();
  }, []);

  useEffect(() => {
    socket?.on("order-err", (errMsg: string) => {
      toast.warning(errMsg);
    });
    return () => {
      socket?.off("order-err");
    };
  }, []);

  return (
    <OrderChainContext.Provider value={{ fetchOrderChains }}>
      <Box>
        <BackToHomePage />
        <BalanceAndPosition />
        <AutoActive />
        <Stack direction="row" alignItems={"flex-end"} justifyContent={"space-between"}>
          <TitleAndNewChainBtn />
          <MarkAsClosedBtn />
        </Stack>
        <OrderChains orderChains={orderChains} />
      </Box>
    </OrderChainContext.Provider>
  );
};

const BalanceAndPosition = () => {
  return (
    <Grid container columnGap={2}>
      <Grid item xs={12} sm={3.5}>
        <Balance />
      </Grid>
      <Grid item xs={12} sm={8}>
        <Position />
      </Grid>
    </Grid>
  );
};

const TitleAndNewChainBtn = () => {
  return (
    <Box my={4}>
      <Typography mb={2} variant="h5">
        BOT - danh sách hoạt động
      </Typography>
      <NewOrderChain />
    </Box>
  );
};

const MarkAsClosedBtn = () => {
  return (
    <Box my={4}>
      <MarkAllChainsAsClosed />
    </Box>
  );
};
