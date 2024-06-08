// take first time render pieces from parent
// define method when pagination currentPage change

import { Stack, Typography, styled } from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { CustomPagi } from "../../components/Table/CustomPagi";
import { usePagination } from "../../hooks/usePagination";
import { TPagiApiShort, getApi } from "../../request/request";
import {
  IMarketOrderPieceRecord,
  TMarketOrderChainWithPiecesPagi,
  TOrderChainStatus,
} from "../../shared/types/order";
import { OrderPieces } from "./OrderPieces";
import { SocketContext } from "../../context/SocketContext";
import { toast } from "react-toastify";
import { BotContext } from "../../context/BotContext";
import { OrderChainContext } from "../../context/OrderChainContext";

type Props = {
  status: TOrderChainStatus;
  chainId: number;
  orderPieces: IMarketOrderPieceRecord[];
  pagi: TPagiApiShort;
};

type TFetchOrderPiecesParams = {
  chainId: number;
  currPage: number;
  perpage: number;
};
export const ListOrderPiece: React.FC<Props> = ({
  status,
  chainId,
  orderPieces,
  pagi,
}) => {
  const { totalItems: totalItemsInit } = pagi;
  const [pieces, setPieces] = useState<IMarketOrderPieceRecord[]>(orderPieces);
  const [totalItems, setTotalItems] = useState(totalItemsInit);

  // if (pieces !== orderPieces) {
  //   setPieces(orderPieces);
  // }
  // if (totalItems !== totalItemsInit && status ==="open") {
  //   setTotalItems(totalItemsInit);
  // }

  const socket = useContext(SocketContext);
  const bot = useContext(BotContext);
  const { fetchOrderChains } = useContext(OrderChainContext);

  const {
    currPage,
    onGoToStart,
    onGoToEnd,
    onPerPageChange,
    perpage,
    totalPage,
    onNextPage,
    onPrevPage,
  } = usePagination({ rows: totalItems });

  const isInitialRender = useRef(true);

  // Define fetch data and update component state method
  const fetchOrderPieces = useCallback(
    async ({ chainId, currPage, perpage }: TFetchOrderPiecesParams) => {
      // Api call
      const url = "order-chain/pieces-by-id";
      const params = {
        chain_id: `${chainId}`,
        page: `${currPage}`,
        perpage: `${perpage}`,
      };
      const response = await getApi<TMarketOrderChainWithPiecesPagi>(
        url,
        params
      );
      // Update state data
      if (response.success) {
        const orderChainWithPiecesPagi = response.data;
        const { data, pagi } = orderChainWithPiecesPagi.order_pieces;
        setPieces(data);
        setTotalItems(pagi.totalItems); // cause totalItems in DB is not stable
      }
    },
    [currPage, perpage, chainId]
  );

  useEffect(() => {
    // Skip the API call on initial render as we already have the data from props
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    // If don't skip so refetch and update order pieces
    fetchOrderPieces({ currPage, perpage, chainId });
  }, [currPage, perpage, chainId]);

  // socket listen event
  useEffect(() => {
    if (status === "open") {
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

          fetchOrderPieces({ currPage, perpage, chainId });
        }
      );
      return () => {
        socket?.off("bot-tick");
      };
    }
  }, [status, currPage, perpage, chainId]);

  useEffect(() => {
    if (status === "open") {
      socket?.on("bot-quit", (msg) => {
        toast.info(msg);
        bot.onToggle(false);
        fetchOrderChains();
      });
      return () => {
        socket?.off("bot-quit");
      };
    }
  }, [status]);

  return (
    <>
      <OrderPiecesHeader />
      <OrderPieces orderPieces={pieces} />
      <CustomPagi
        currPage={currPage}
        perpage={perpage}
        totalItems={totalItems}
        totalPage={totalPage}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onGoToEnd={onGoToEnd}
        onGoToStart={onGoToStart}
        onPerPageChange={onPerPageChange}
      />
    </>
  );
};

const OrderPiecesHeader = () => {
  return (
    <Stack mb={1} direction={"row"} spacing={2} justifyContent={"space-around"}>
      <PieceHeader>id</PieceHeader>
      <PieceHeader>symbol</PieceHeader>
      <PieceHeader>direction</PieceHeader>
      <PieceHeader>transaction_size</PieceHeader>
      <PieceHeader>price</PieceHeader>
      <PieceHeader>percent_change</PieceHeader>
      <PieceHeader>quantity</PieceHeader>
      <PieceHeader>createdAt</PieceHeader>
    </Stack>
  );
};
const PieceCell = styled(Typography)({
  flexBasis: `${100 / 8}%`,
});
const PieceHeader = styled(PieceCell)({
  textAlign: "left",
});
