import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const OrderCreate = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Button variant="contained" onClick={() => navigate("/chuoi-lenh")}>
        + Bot - lịch sử hoạt động
      </Button>
    </Box>
  );
};
