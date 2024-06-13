import { Box, Grid, Typography } from "@mui/material";
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

export const ListOrderChain = () => {
  const [orderChains, setOrderChains] = useState<
    TMarketOrderChainWithPiecesPagi[]
  >([]);
  const socket = useContext(SocketContext);
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
        <BalanceAndPosition />
        <TitleAndNewChainBtn />
        <OrderChains orderChains={orderChains} />
      </Box>
    </OrderChainContext.Provider>
  );
};

const BalanceAndPosition = () => {
  return (
    <Grid container columnGap={2}>
      <Grid xs={12} sm={3.5}>
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
    <Box my={4}>
      <Typography mb={2} variant="h5">
        BOT - danh sách hoạt động
      </Typography>
      <NewOrderChain />
    </Box>
  );
};
