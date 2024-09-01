import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, CircularProgress, Dialog, IconButton, Stack, Typography, styled } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import dayjs from "dayjs";
import React, { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { BaseInput } from "../../components/Input";
import { IcOutlineKeyboardReturn, IcSharpFileDownloadDone } from "../../icons/Icons";
import { deleteApi, putApi } from "../../request/request";
import { TMarketOrderChainWithPiecesPagi } from "../../shared/types/order";
import { ListOrderPiece } from "./ListOrderPiece";
import { OrderChainContext } from "../../context/OrderChainContext";

type Props = {
  orderChains: TMarketOrderChainWithPiecesPagi[];
};
export const OrderChains: React.FC<Props> = ({ orderChains }) => {
  const [openCfDialog, setOpenCfDialg] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [dialogHandlers, setDialogHandlers] = useState<{ onConfirm: () => void; onCancel: () => void }>({
    onConfirm: () => {},
    onCancel: () => {},
  });

  const { fetchOrderChains } = useContext(OrderChainContext);

  const onDeleteItem = async (itemId: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setOpenCfDialg(true);

      const handleConfirmDelete = async () => {
        try {
          setIsDeleting(true);

          const response = await deleteApi(`order-chain/${itemId}`);
          if (response.success) {
            toast.success("Delete succeeded!");
            fetchOrderChains();
            resolve(true);
          } else {
            toast.error(response.error.message);
            resolve(false);
          }
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setIsDeleting(false);
          setOpenCfDialg(false);
        }
      };

      const handleCancelDelete = () => {
        setOpenCfDialg(false);
        resolve(false);
      };

      setDialogHandlers({ onConfirm: handleConfirmDelete, onCancel: handleCancelDelete });
    });
  };
  return (
    <>
      {!orderChains.length ? (
        <Typography my={4} textAlign={"center"} fontSize={28}>
          Chưa có chuỗi lệnh được đặt
        </Typography>
      ) : (
        <>
          {orderChains.map((chain) => (
            <Box>
              <OrderChain chain={chain} onDelete={onDeleteItem} key={chain.id} />
            </Box>
          ))}

          <Dialog open={openCfDialog} onClose={dialogHandlers.onCancel}>
            <Box p={4}>
              <Typography variant="h6">Xác nhận xóa?</Typography>
              <Box mb={2} />

              <Stack direction="row" spacing={1} justifyContent={"flex-end"} alignItems={"center"}>
                <Button onClick={dialogHandlers.onCancel} variant="outlined">
                  Close
                </Button>
                <Button
                  onClick={dialogHandlers.onConfirm}
                  startIcon={isDeleting && <CircularProgress color="inherit" size={14} />}
                  variant="contained"
                  color="error"
                >
                  Xóa
                </Button>
              </Stack>
            </Box>
          </Dialog>
        </>
      )}
    </>
  );
};

type ChainProps = {
  chain: TMarketOrderChainWithPiecesPagi;
  onDelete: (id: number) => Promise<boolean>;
};

const OrderChain: React.FC<ChainProps> = ({ chain, onDelete }) => {
  const { order_pieces, status, id } = chain;
  const { data, pagi } = order_pieces;

  return (
    <Box mb={4}>
      <IconButton onClick={() => onDelete(id)} disabled={status === "open"}>
        <DeleteIcon color="error" />
      </IconButton>{" "}
      <ChainBox open={status === "open"}>
        <Box>
          <ChainInfo chainInfo={chain} />
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
    symbol_max_pnl_start,
    symbol_max_pnl_threshold,
    symbol_pnl_to_cutloss,
    price_type,
    start_reason,
    updatedAt,
  } = chainInfo;
  const [isEdit, setIsEdit] = useState(false);
  const inputRef = useRef(null);

  const updatePnlToStop = async () => {
    try {
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
    } catch (error: any) {
      toast.error(error.message);
    } finally {
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
              <IconButton sx={{ padding: "4px", height: "32px" }} onClick={updatePnlToStop} disabled={status === "closed"}>
                <IcSharpFileDownloadDone color={"green"} fontSize={24} />
              </IconButton>
            </Stack>
          )}

          <Typography>
            symbol_max_pnl_start:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {symbol_max_pnl_start}$
            </Typography>
          </Typography>

          <Typography>
            symbol_max_pnl_threshold:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {symbol_max_pnl_threshold}
            </Typography>
          </Typography>

          <Typography>
            symbol_pnl_to_cutloss:{" "}
            <Typography sx={{ fontWeight: 600 }} component={"span"}>
              {symbol_pnl_to_cutloss}$
            </Typography>
          </Typography>

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
