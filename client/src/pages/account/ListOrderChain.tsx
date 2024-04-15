import { Box, Stack, Typography, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
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

  useEffect(() => {
    socket?.on(
      "new-order",
      (direction, transaction_size, percent_change, price, symbol) => {
        // console.log(direction, transaction_size, percent_change, price, symbol);
        const toastNotiMsg = `Lênh mới được tạo: ${direction} ${transaction_size} USD của ${symbol} giá ${price} USD với %giá thay đổi ${percent_change}`;
        // toast.success("toastNotiMsg");
        toast.success(toastNotiMsg);

        fetchOrderChains();
      }
    );
    return () => {
      socket?.off("new-order");
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
  const { order_pieces, id } = props;
  return (
    <ChainBox>
      <Stack direction={"row"}>
        <Typography>{id}</Typography>
      </Stack>
      <Stack spacing={1}>
        <Stack direction={"row"} spacing={2} justifyContent={"space-around"}>
          <Typography>id</Typography>
          <Typography>total_balance</Typography>
          <Typography>price</Typography>
          <Typography>percent_change</Typography>

          <Typography>createdAt</Typography>
        </Stack>
        {order_pieces.map((piece) => (
          <OrderPiece {...piece} />
        ))}
      </Stack>
    </ChainBox>
  );
};

const OrderPiece = (props: IMarketOrderPieceRecord) => {
  const { id, total_balance, price, percent_change, createdAt } = props;
  return (
    <PieceBox>
      <Stack direction={"row"} spacing={2} justifyContent={"space-around"}>
        <Typography>{id}</Typography>
        <Typography>{total_balance}</Typography>
        <Typography>{price}</Typography>
        <Typography>{percent_change}%</Typography>

        <Typography>
          {dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}
        </Typography>
      </Stack>
    </PieceBox>
  );
};

const ChainBox = styled(Box)(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  backgroundColor: grey["400"],
  [theme.breakpoints.down("sm")]: {},
}));
const PieceBox = styled(Box)(({ theme }) => ({
  padding: 8,
  paddingLeft: 16,
  borderRadius: 8,
  backgroundColor: grey["50"],
  [theme.breakpoints.down("sm")]: {},
}));
