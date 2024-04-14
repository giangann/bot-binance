import { Box, Stack, Typography, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getApi } from "../../request/request";
import {
  IMarketOrderChainRecord,
  IMarketOrderPieceRecord,
} from "../../shared/types/order";
import { NewOrderChain } from "./NewOrderChain";

export const ListOrderChain = () => {
  const [orderChains, setOrderChains] = useState<IMarketOrderChainRecord[]>([]);

  useEffect(() => {
    async function fetchOrderChains() {
      const response = await getApi<IMarketOrderChainRecord[]>("order-chain");
      if (response.success) setOrderChains(response.data);
    }
    fetchOrderChains();
  }, []);
  return (
    <Box>
      <Stack direction={"row"} spacing={2}>
        <Typography variant="h5">Danh sách chuỗi lệnh</Typography>
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
        {order_pieces.map((piece) => (
          <OrderPiece {...piece} />
        ))}
      </Stack>
    </ChainBox>
  );
};

const OrderPiece = (props: IMarketOrderPieceRecord) => {
  const { id, total_balance, createdAt } = props;
  return (
    <PieceBox>
      <Stack direction={"row"} spacing={2}>
        <Typography>{id}</Typography>
        <Typography>{total_balance}</Typography>
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
