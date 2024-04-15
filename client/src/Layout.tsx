import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { SocketContext } from "./context/SocketContext";
import { io } from "socket.io-client";
import { baseURL } from "./request/request";

const wsServer = io(baseURL);
export const Layout = () => {
  return (
    <SocketContext.Provider value={wsServer}>
      <Box sx={{ maxWidth: 1500, margin: "auto", padding: { xs: 1, sm: 2 } }}>
        <Outlet />
      </Box>
    </SocketContext.Provider>
  );
};
