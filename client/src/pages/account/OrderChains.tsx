import { Box, IconButton, Stack, Typography, styled } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { BaseInput } from "../../components/Input";
import { IcOutlineKeyboardReturn, IcSharpFileDownloadDone } from "../../icons/Icons";
import { putApi } from "../../request/request";
import { TMarketOrderChainWithPiecesPagi } from "../../shared/types/order";
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
        <>
          {orderChains.map((chain) => (
            <OrderChain {...chain} key={chain.id} />
          ))}
        </>
      )}
    </>
  );
};

const OrderChain = (props: TMarketOrderChainWithPiecesPagi) => {
  const { order_pieces, status, id } = props;
  const { data, pagi } = order_pieces;

  return (
    <Box mb={4}>
      <ChainBox open={status === "open"}>
        <Box>
          <ChainInfo chainInfo={props} />
          <ListOrderPiece status={status} chainId={id} orderPieces={data} pagi={pagi} />
        </Box>
      </ChainBox>
    </Box>
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
    pnl_to_stop,
    stop_reason,
    max_pnl_start,
    max_pnl_threshold_to_quit,
    price_type,
    start_reason,
    updatedAt,
  } = chainInfo;
  const [isEdit, setIsEdit] = useState(false);
  const inputRef = useRef(null);

  const updatePnlToStop = async () => {
    // @ts-ignore
    const newValue = inputRef.current ? inputRef.current.value : pnl_to_stop;
    const response = await putApi(`order-chain/${id}`, {
      pnl_to_stop: newValue,
    });

    if (response.success) {
      toast.success("Update success");
    } else {
      toast.error(response.error.message);
    }
  };
  return (
    <Box
      sx={{
        overflowX: "auto",
        padding: 1,
        mb: 1,
        borderBottom: `1px solid ${grey["50"]}`,
      }}
    >
      <Stack direction={"row"} spacing={2}>
        <Typography>{id}</Typography>
        <Stack direction={"row"} spacing={2} justifyContent={"space-around"}>
          <Typography>
            status:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {status}
            </Typography>
          </Typography>
          {/*  */}
          <Typography whiteSpace={"nowrap"}>
            start_reason:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {start_reason ?? "null"}
            </Typography>
          </Typography>
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
          <Typography>
            max_pnl_start:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {max_pnl_start}$
            </Typography>
          </Typography>
          <Typography>
            max_pnl_threshold_to_quit:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {max_pnl_threshold_to_quit}
            </Typography>
          </Typography>
          <Typography>
            price_type:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {price_type}
            </Typography>
          </Typography>

          {!isEdit && (
            <div onClick={() => setIsEdit(true)} onMouseOut={() => console.log("mouse out")}>
              <Typography>
                pnl_to_stop:{" "}
                <Typography sx={{ fontWeight: 600 }} component={"span"}>
                  {pnl_to_stop}$
                </Typography>
              </Typography>
            </div>
          )}

          {isEdit && (
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton sx={{ padding: "4px", height: "32px" }} onClick={() => setIsEdit(false)}>
                <IcOutlineKeyboardReturn color={"blue"} fontSize={24} />
              </IconButton>
              <BaseInput sx={{ minWidth: "unset", width: "70px" }} ref={inputRef} defaultValue={pnl_to_stop} />
              <IconButton sx={{ padding: "4px", height: "32px" }} onClick={updatePnlToStop} disabled>
                <IcSharpFileDownloadDone color={"green"} fontSize={24} />
              </IconButton>
            </Stack>
          )}
          {status === "closed" && (
            <>
              <Typography>
                closedAt:{" "}
                <Typography sx={{ fontWeight: 600 }} component={"span"}>
                  {dayjs(updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                </Typography>
              </Typography>
              <Typography>
                reason:{" "}
                <Typography sx={{ fontWeight: 600 }} component={"span"}>
                  {stop_reason ?? "null"}
                </Typography>
              </Typography>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

const ChainBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open, theme }) => ({
  padding: 16,
  backgroundColor: open ? blue["200"] : grey["400"],
  [theme.breakpoints.down("sm")]: {
    padding: 0,
  },
}));
