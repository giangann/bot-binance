import { Box } from "@mui/material";
import { OrderCreate } from "./OrderCreate";
import { OrderHistory } from "./OrderHistory";

export const Order = () => {
  return (
    <Box>
      <OrderCreate />
      <OrderHistory />
    </Box>
  );
};
