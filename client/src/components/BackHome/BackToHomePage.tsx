import HomeIcon from "@mui/icons-material/Home";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const BackToHomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", m: 2, width: "100%" }}>
      <Button onClick={() => navigate("/")} startIcon={<HomeIcon />} variant="contained" color="success">
        Back to Home
      </Button>
    </Box>
  );
};
