// take first time render pieces from parent
// define method when pagination currentPage change

import { useEffect, useState } from "react";
import { IMarketOrderPieceRecord } from "../../shared/types/order";
import { getApi } from "../../request/request";
import { TPagination } from "../../request/request";
import { usePagination } from "../../hooks/usePagination";
import { CustomPagi } from "../../components/Table/CustomPagi";
import { OrderPieces } from "./OrderPieces";

type Props = {
  orderPieces: IMarketOrderPieceRecord[];
  pagi: TPagination;
};
export const ListOrderPiece: React.FC<Props> = ({ orderPieces, pagi }) => {
  const { totalItems: totalItemsInit } = pagi;
  const [pieces, setPieces] = useState<IMarketOrderPieceRecord[]>(orderPieces);
  const [totalItems, setTotalItems] = useState(totalItemsInit);

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
    if (currPage === 1) {
      // Skip the API call on initial render as we already have the data from props
      return;
    }

    async function fetchOrderPieces() {
      // Api call
      const response = await getApi<IMarketOrderPieceRecord[]>("", {
        page: `${currPage}`,
        perpage: `${perpage}`,
      });
      // Update state data
      if (response.success) {
        setPieces(response.data);
        setTotalItems(response.pagi.totalItems); // cause totalItems in DB is not stable
      }
    }

    fetchOrderPieces();
  }, [currPage, perpage]);
  return (
    <>
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

