import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { SocketContext } from "./context/SocketContext";
import { io } from "socket.io-client";
import { baseURL } from "./request/request";
import { useEffect } from "react";
import { toast } from "react-toastify";

const wsServer = io(baseURL);
export const Layout = () => {
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
  return (
    <SocketContext.Provider value={wsServer}>
      <Box sx={{ maxWidth: 1500, margin: "auto", padding: { xs: 1, sm: 2 } }}>
        <Outlet />
      </Box>
    </SocketContext.Provider>
  );
};
