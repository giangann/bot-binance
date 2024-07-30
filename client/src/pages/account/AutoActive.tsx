import { Box } from "@mui/material";
import { AutoActiveConfig } from "./AutoActiveConfig";
import { MarketPrice } from "./MarketPrice";
import { useContext, useEffect } from "react";
import { SocketContext } from "../../context/SocketContext";
import { OrderChainContext } from "../../context/OrderChainContext";
import { toast } from "react-toastify";
import { BotContext } from "../../context/BotContext";

export const AutoActive = () => {
  const socket = useContext(SocketContext);
  const bot = useContext(BotContext)
  const { fetchOrderChains } = useContext(OrderChainContext);

  useEffect(() => {
    socket?.on("bot-active", (activeReason: string) => {
      fetchOrderChains();
      bot.onToggle(true)
      toast.info(activeReason);
    });
    return () => {
      socket?.off("bot-active");
    };
  }, []);

  return (
    <Box>
      <AutoActiveConfig />
      <MarketPrice />
    </Box>
  );
};
