import { Box, Stack, Typography, styled } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import dayjs from "dayjs";
import { useCallback, useContext, useEffect, useState } from "react";
import { getApi } from "../../request/request";
import {
  IMarketOrderChainRecord,
  IMarketOrderPieceRecord,
} from "../../shared/types/order";
import { NewOrderChain } from "./NewOrderChain";
import { Balance } from "./Balance";
import { SocketContext } from "../../context/SocketContext";
import { toast } from "react-toastify";

export const ListOrderChain = () => {
  const [orderChains, setOrderChains] = useState<IMarketOrderChainRecord[]>([]);
  const socket = useContext(SocketContext);
  const fetchOrderChains = useCallback(async () => {
    const response = await getApi<IMarketOrderChainRecord[]>("order-chain");
    if (response.success) setOrderChains(response.data);
  }, []);
  useEffect(() => {
    fetchOrderChains();
  }, []);

  // useEffect(() => {
  //   socket?.on(
  //     "new-order",
  //     (direction, transaction_size, percent_change, price, symbol) => {
  //       // console.log(direction, transaction_size, percent_change, price, symbol);
  //       const toastNotiMsg = `Lênh mới được tạo: ${direction} ${transaction_size} USD của ${symbol} giá ${price} USD với %giá thay đổi ${percent_change}`;
  //       // toast.success("toastNotiMsg");
  //       toast.success(toastNotiMsg);

  //       fetchOrderChains();
  //     }
  //   );
  //   return () => {
  //     socket?.off("new-order");
  //   };
  // }, []);

  useEffect(() => {
    socket?.on("new-orders", (nums_of_order: number) => {
      // console.log(direction, transaction_size, percent_change, price, symbol);
      const toastNotiMsg = `Có ${nums_of_order} lệnh mới được tạo`;
      // toast.success("toastNotiMsg");
      toast.success(toastNotiMsg);

      fetchOrderChains();
    });
    return () => {
      socket?.off("new-orders");
    };
  }, []);

  useEffect(() => {
    socket?.on("order-err", (errMsg: string) => {
      toast.warning(errMsg);
    });
    return () => {
      socket?.off("order-err");
    };
  }, []);

  useEffect(() => {
    socket?.on("bot-quit", (msg) => {
      toast.info(msg);
      fetchOrderChains();
    });
    return () => {
      socket?.off("new-order");
    };
  }, []);
  return (
    <Box>
      <Balance />
      <Stack direction={"row"} spacing={2} my={2}>
        <Typography variant="h5">BOT - danh sách hoạt động</Typography>
        <NewOrderChain />
      </Stack>
      {!orderChains.length ? (
        <Typography my={4} textAlign={"center"} fontSize={28}>
          Chưa có chuỗi lệnh được đặt
        </Typography>
      ) : (
        <Stack spacing={2}>
          {orderChains.map((chain) => (
            <OrderChain {...chain} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

const OrderChain = (props: IMarketOrderChainRecord) => {
  const {
    order_pieces,
    id,
    status,
    total_balance_start,
    transaction_size_start,
    percent_to_buy,
    percent_to_sell,
    total_balance_end,
    percent_change,
  } = props;
  return (
    <ChainBox open={status === "open"}>
      <Stack
        direction={"row"}
        spacing={2}
        sx={{ borderBottom: `1px solid ${grey["50"]}`, pb: 0.5, mb: 1 }}
      >
        <Typography>{id}</Typography>
        <Stack direction={"row"} spacing={2} justifyContent={"space-around"}>
          <Typography>
            status:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {status}
            </Typography>
          </Typography>
          {/*  */}
          <Typography>
            transaction_size_start:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {transaction_size_start} USD
            </Typography>
          </Typography>
          <Typography>
            percent_to_buy:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {percent_to_buy}%
            </Typography>
          </Typography>
          <Typography>
            percent_to_sell:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {percent_to_sell}%
            </Typography>
          </Typography>
          {/*  */}
          <Typography>
            total_balance_start:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {total_balance_start}
            </Typography>
          </Typography>
          <Typography>
            total_balance_end:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {total_balance_end}
            </Typography>
          </Typography>
          <Typography>
            percent_change:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {percent_change}%
            </Typography>
          </Typography>
        </Stack>
      </Stack>
      <Stack spacing={1}>
        <Stack direction={"row"} spacing={2} justifyContent={"space-around"}>
          <PieceHeader>id</PieceHeader>
          <PieceHeader>symbol</PieceHeader>
          <PieceHeader>direction</PieceHeader>
          <PieceHeader>transaction_size</PieceHeader>
          <PieceHeader>price</PieceHeader>
          <PieceHeader>percent_change</PieceHeader>
          <PieceHeader>amount</PieceHeader>
          <PieceHeader>createdAt</PieceHeader>
        </Stack>
        {order_pieces.map((piece) => (
          <OrderPiece {...piece} />
        ))}
      </Stack>
    </ChainBox>
  );
};

const OrderPiece = (props: IMarketOrderPieceRecord) => {
  const {
    id,
    symbol,
    transaction_size,
    amount,
    direction,
    price,
    percent_change,
    createdAt,
  } = props;
  return (
    <PieceBox>
      <Stack direction={"row"} spacing={2} justifyContent={"space-around"}>
        <PieceCell>{id}</PieceCell>
        <PieceCell>{symbol}</PieceCell>
        <PieceCell>{direction}</PieceCell>
        <PieceCell>{transaction_size}</PieceCell>
        <PieceCell>{price}</PieceCell>
        <PieceCell>{parseFloat(percent_change).toFixed(2)}%</PieceCell>
        <PieceCell>{parseFloat(amount).toFixed(5)}</PieceCell>

        <PieceCell>{dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}</PieceCell>
      </Stack>
    </PieceBox>
  );
};

const ChainBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open, theme }) => ({
  padding: 16,
  borderRadius: 16,
  backgroundColor: open ? blue["200"] : grey["400"],
  [theme.breakpoints.down("sm")]: {},
}));
const PieceBox = styled(Box)(({ theme }) => ({
  padding: 8,
  paddingLeft: 16,
  marginLeft: 8,
  borderRadius: 8,
  backgroundColor: grey["50"],
  [theme.breakpoints.down("sm")]: {},
}));
const PieceCell = styled(Typography)({
  flexBasis: `${100 / 8}%`,
});

const PieceHeader = styled(PieceCell)({
  textAlign: "left",
});
