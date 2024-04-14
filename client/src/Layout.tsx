import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <Box sx={{ maxWidth: 1500, margin: "auto", padding: { xs: 1, sm: 2 } }}>
      <Outlet />
    </Box>
  );
};
