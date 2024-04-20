import { Box, Button, styled } from "@mui/material";

export const FlexDefaultBox = styled(Box)({
  display: "flex",
});
export const BoxFlexEnd = styled(FlexDefaultBox)({
  justifyContent: "flex-end",
});
// BUTTON
export const ButtonResponsive = styled(Button)(({ theme }) => ({
  fontSize: 14,
  padding: "4px 14px",
  textTransform: "none",
  [theme.breakpoints.up("sm")]: {
    fontSize: 16,
    padding: "6px 16px",
  },
}));

export const CenterBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
