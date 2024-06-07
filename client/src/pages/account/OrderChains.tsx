import ArticleIcon from "@mui/icons-material/Article";
import { Box, Stack, Typography, styled } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { TMarketOrderChainWithPiecesPagi } from "../../shared/types/order";
import { CenterBox } from "../../styled/styled";
import { ListOrderPiece } from "./ListOrderPiece";

// take orderChains array as props, render many OrderChain
// OrderChain: take orderChain as props, render orderChain detail and ListOrderPiece

type Props = {
  orderChains: TMarketOrderChainWithPiecesPagi[];
};
export const OrderChains: React.FC<Props> = ({ orderChains }) => {
  return (
    <>
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
    </>
  );
};

const OrderChain = (props: TMarketOrderChainWithPiecesPagi) => {
  const { order_pieces, status, id } = props;
  const { data, pagi } = order_pieces;

  return (
    <Box>
      <ViewChainLog id={id} />
      <ChainBox open={status === "open"}>
        <ChainInfo chainInfo={props} />

        <ListOrderPiece chainId={id} orderPieces={data} pagi={pagi} />
      </ChainBox>
    </Box>
  );
};

const ViewChainLog = ({ id }: Pick<TMarketOrderChainWithPiecesPagi, "id">) => {
  return (
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
  );
};

type ChainInfoProps = {
  chainInfo: Omit<TMarketOrderChainWithPiecesPagi, "order_pieces">;
};
const ChainInfo = ({ chainInfo }: ChainInfoProps) => {
  const {
    id,
    status,
    transaction_size_start,
    percent_to_first_buy,
    percent_to_buy,
    percent_to_sell,
  } = chainInfo;
  return (
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
          percent_to_first_buy:{" "}
          <Typography sx={{ fontWeight: 600 }} component={"span"}>
            {percent_to_first_buy}%
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

const ViewLogButton = styled(Box)({
  margin: "auto",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
});
