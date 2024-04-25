import ArticleIcon from "@mui/icons-material/Article";
import { Box, Stack, Typography, styled } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import dayjs from "dayjs";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/SocketContext";
import { getApi } from "../../request/request";
import {
  IMarketOrderChainRecord,
  IMarketOrderPieceRecord,
} from "../../shared/types/order";
import { CenterBox } from "../../styled/styled";
import { Balance } from "./Balance";
import { NewOrderChain } from "./NewOrderChain";

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
      "bot-tick",
      (
        nums_of_order: number,
        num_of_success_order: number,
        num_of_error_order: number
      ) => {
        const infoMsg = `Có ${nums_of_order} lệnh được đặt`;
        const successMsg = `Có ${num_of_success_order} lệnh thành công`;
        const errorMsg = `Có ${num_of_error_order} lệnh thất bại`;
        toast.info(infoMsg);
        toast.success(successMsg);
        toast.error(errorMsg);

        fetchOrderChains();
      }
    );
    return () => {
      socket?.off("bot-tick");
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
      socket?.off("bot-quit");
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
    transaction_size_start,
    percent_to_buy,
    percent_to_sell,
  } = props;

  return (
    <Box>
      <CenterBox mb={0.5}>
        <a href={`/log/${id}`} target="_blank">
          <ViewLogButton>
            <Typography display={"inline"} mr={1}>
              View log
            </Typography>
            <ArticleIcon />
          </ViewLogButton>
        </a>
      </CenterBox>
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
    </Box>
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

const ViewLogButton = styled(Box)({
  margin: "auto",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
});
