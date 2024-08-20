import { Box, Stack, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BackToHomePage } from "../../components/BackHome/BackToHomePage";
import { OrderChainContext } from "../../context/OrderChainContext";
import { SocketContext } from "../../context/SocketContext";
import { getApi } from "../../request/request";
import { TMarketOrderChainTestWithPiecesPagi } from "../../shared/types/order-test";
import { MarkAllChainsTestAsClosed } from "./MarkAllChainsTestAsClosed";
import { NewOrderChainTest } from "./NewOrderChainTest";
import { OrderChainsTest } from "./OrderChainsTest";

export const ListOrderChainTest = () => {
  const [orderChains, setOrderChains] = useState<TMarketOrderChainTestWithPiecesPagi[]>([]);
  const socket = useContext(SocketContext);
  const fetchOrderChains = useCallback(async () => {
    const response = await getApi<TMarketOrderChainTestWithPiecesPagi[]>("order-chain-test");
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
        <Stack direction="row" alignItems={"flex-end"} justifyContent={"space-between"}>
          <TitleAndNewChainBtn />
          <MarkAsClosedBtn />
        </Stack>
        <OrderChainsTest orderChains={orderChains} />
      </Box>
    </OrderChainContext.Provider>
  );
};

const TitleAndNewChainBtn = () => {
  return (
    <Box my={4}>
      <Typography mb={2} variant="h5">
        BOT - danh sách test
      </Typography>
      <NewOrderChainTest />
    </Box>
  );
};

const MarkAsClosedBtn = () => {
  return (
    <Box my={4}>
      <MarkAllChainsTestAsClosed />
    </Box>
  );
};
