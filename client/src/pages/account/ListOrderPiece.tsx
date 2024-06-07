// take first time render pieces from parent
// define method when pagination currentPage change

import { Stack, Typography, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { CustomPagi } from "../../components/Table/CustomPagi";
import { usePagination } from "../../hooks/usePagination";
import { TPagiApiShort, getApi } from "../../request/request";
import {
  IMarketOrderPieceRecord,
  TMarketOrderChainWithPiecesPagi,
} from "../../shared/types/order";
import { OrderPieces } from "./OrderPieces";

type Props = {
  chainId: number;
  orderPieces: IMarketOrderPieceRecord[];
  pagi: TPagiApiShort;
};
export const ListOrderPiece: React.FC<Props> = ({
  chainId,
  orderPieces,
  pagi,
}) => {
  const { totalItems: totalItemsInit } = pagi;
  const [pieces, setPieces] = useState<IMarketOrderPieceRecord[]>(orderPieces);
  const [totalItems, setTotalItems] = useState(totalItemsInit);
  const isInitialRender = useRef(true);

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

  useEffect(() => {
    // Skip the API call on initial render as we already have the data from props
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // Define fetch data and update component state method
    async function fetchOrderPieces() {
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
    }

    fetchOrderPieces();
  }, [currPage, perpage]);
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
