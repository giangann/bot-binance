import { Box, Stack, Typography, styled } from "@mui/material";
import { green, red } from "@mui/material/colors";
import dayjs from "dayjs";
import React from "react";
import {
    IMarketOrderPieceRecord
} from "../../shared/types/order";

type Props = {
  orderPieces: IMarketOrderPieceRecord[];
};
export const OrderPieces: React.FC<Props> = ({ orderPieces }) => {
  return (
    <Stack spacing={1}>
      <Stack direction={"row"} spacing={2} justifyContent={"space-around"}>
        <PieceHeader>id</PieceHeader>
        <PieceHeader>symbol</PieceHeader>
        <PieceHeader>direction</PieceHeader>
        <PieceHeader>transaction_size</PieceHeader>
        <PieceHeader>price</PieceHeader>
        <PieceHeader>percent_change</PieceHeader>
        <PieceHeader>quantity</PieceHeader>
        <PieceHeader>createdAt</PieceHeader>
      </Stack>
      {orderPieces.map((piece) => (
        <OrderPiece {...piece} />
      ))}
    </Stack>
  );
};

const OrderPiece = (props: IMarketOrderPieceRecord) => {
  const {
    id,
    symbol,
    transaction_size,
    quantity,
    direction,
    price,
    percent_change,
    createdAt,
  } = props;
  return (
    <PieceBox direction={direction as "BUY" | "SELL"}>
      <Stack direction={"row"} spacing={2} justifyContent={"space-around"}>
        <PieceCell>{id}</PieceCell>
        <PieceCell>{symbol}</PieceCell>
        <PieceCell>{direction}</PieceCell>
        <PieceCell>{parseFloat(transaction_size).toFixed(3)}</PieceCell>
        <PieceCell>{price}</PieceCell>
        <PieceCell>{parseFloat(percent_change).toFixed(2)}%</PieceCell>
        <PieceCell>{parseFloat(quantity)}</PieceCell>

        <PieceCell>{dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}</PieceCell>
      </Stack>
    </PieceBox>
  );
};

const PieceBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "direction",
})<{ direction: "BUY" | "SELL" }>(({ direction, theme }) => ({
  padding: 16,
  borderRadius: 16,
  backgroundColor: direction === "BUY" ? green["50"] : red["50"],
  [theme.breakpoints.down("sm")]: {},
}));
const PieceCell = styled(Typography)({
  flexBasis: `${100 / 8}%`,
});

const PieceHeader = styled(PieceCell)({
  textAlign: "left",
});
