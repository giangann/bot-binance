import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { SocketContext } from "./context/SocketContext";
import { io } from "socket.io-client";
import { baseURL, getApi } from "./request/request";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BotContext } from "./context/BotContext";

const wsServer = io(baseURL);
export const Layout = () => {
  const [botActive, setBotActive] = useState(false);

  const onToggle = (active: boolean) => {
    setBotActive(active);
  };

  useEffect(() => {
    wsServer?.on("app-err", (err: string) => {
      const error = JSON.parse(err);
      const errMsg = error.message;
      toast.error(errMsg);
      console.log(error);
    });
    return () => {
      wsServer?.off("app-err");
    };
  }, []);

  useEffect(() => {
    async function checkIsBotActive() {
      const response = await getApi<{ isActive: boolean }>("bot/status");
      if (response.success) setBotActive(response.data.isActive);
      else {
        toast.error(response.error.message);
      }
    }
    checkIsBotActive();
  }, []);
  return (
    <SocketContext.Provider value={wsServer}>
      <BotContext.Provider value={{ active: botActive, onToggle }}>
        <Box sx={{ maxWidth: 1500, margin: "auto", padding: { xs: 1, sm: 2 } }}>
          <Outlet />
        </Box>
      </BotContext.Provider>
    </SocketContext.Provider>
  );
};
