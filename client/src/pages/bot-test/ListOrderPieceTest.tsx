// take first time render pieces from parent
// define method when pagination currentPage change

import { Typography, styled } from "@mui/material";
import { green, red } from "@mui/material/colors";
import dayjs from "dayjs";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { BasicTable } from "../../components/Table/BasicTable";
import { CustomPagi } from "../../components/Table/CustomPagi";
import { StrictField } from "../../components/Table/Customtable";
import { BotContext } from "../../context/BotContext";
import { OrderChainContext } from "../../context/OrderChainContext";
import { SocketContext } from "../../context/SocketContext";
import { usePagination } from "../../hooks/usePagination";
import { TPagiApiShort, getApi } from "../../request/request";
import { IMarketOrderPieceRecord, TOrderChainStatus } from "../../shared/types/order";
import { IMarketOrderPieceTestRecord, TMarketOrderChainTestWithPiecesPagi } from "../../shared/types/order-test";
import { arraySliceByPagi } from "../../ultils/helper";

type Props = {
  status: TOrderChainStatus;
  chainTestId: number;
  orderPiecesTest: IMarketOrderPieceTestRecord[];
  pagi: TPagiApiShort;
};

type TFetchOrderPiecesTestParams = {
  chainTestId: number;
  currPage: number;
  perpage: number;
};
export const ListOrderPieceTest: React.FC<Props> = ({ status, chainTestId, orderPiecesTest, pagi }) => {
  const { totalItems: totalItemsInit } = pagi;
  const [totalItems, setTotalItems] = useState(totalItemsInit);
  const { currPage, onGoToStart, onGoToEnd, onPerPageChange, perpage, totalPage, onNextPage, onPrevPage } = usePagination({ rows: totalItems });
  const [pieces, setPieces] = useState<IMarketOrderPieceTestRecord[]>(orderPiecesTest);
  const slicePieces = useMemo(() => arraySliceByPagi(pieces, currPage, perpage), [pieces, currPage, perpage]);

  // if (pieces !== orderPiecesTest) {
  //   setPieces(orderPiecesTest);
  // }
  // if (totalItems !== totalItemsInit && status ==="open") {
  //   setTotalItems(totalItemsInit);
  // }

  const socket = useContext(SocketContext);
  const bot = useContext(BotContext);
  const { fetchOrderChains } = useContext(OrderChainContext);

  const isInitialRender = useRef(true);

  // Define fetch data and update component state method
  const fetchorderPiecesTest = useCallback(
    async ({ chainTestId, currPage, perpage }: TFetchOrderPiecesTestParams) => {
      // Api call
      const url = "order-chain-test/pieces-by-id";
      const params = {
        chain_id: `${chainTestId}`,
        page: `${currPage}`,
        perpage: `${perpage}`,
      };
      const response = await getApi<TMarketOrderChainTestWithPiecesPagi>(url, params);
      // Update state data
      if (response.success) {
        const orderChainWithPiecesPagi = response.data;
        const { data, pagi } = orderChainWithPiecesPagi.order_pieces_test;
        setPieces(data);
        setTotalItems(pagi.totalItems); // cause totalItems in DB is not stable
      }
    },
    [currPage, perpage, chainTestId]
  );

  const orderPieceFields: StrictField<IMarketOrderPieceRecord>[] = [
    {
      header: "ID",
      fieldKey: "id",
      width: 200,
    },
    {
      header: "Symbol",
      fieldKey: "symbol",
      width: 200,
    },
    {
      header: "Direction",
      fieldKey: "direction",
      width: 200,
    },
    {
      header: "Transaction Size",
      fieldKey: "transaction_size",
      render: ({ transaction_size }) => <StyledText>{parseFloat(transaction_size).toFixed(3)}</StyledText>,
      width: 300,
    },
    {
      header: "Price",
      fieldKey: "price",
      width: 200,
    },
    {
      header: "Percent Change",
      fieldKey: "percent_change",
      render: ({ percent_change }) => <StyledText>{parseFloat(percent_change).toFixed(2)}%,</StyledText>,
      width: 350,
    },
    {
      header: "Quantity",
      fieldKey: "quantity",
      width: 200,
    },
    {
      header: "Created At",
      fieldKey: "createdAt",
      render: ({ createdAt }) => <StyledText>{dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}</StyledText>,
      width: 400,
    },
  ];

  useEffect(() => {
    // Skip the API call on initial render as we already have the data from props
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // This effect don't use for open cain
    if (status === "open") return;

    // If don't skip so refetch and update order pieces
    fetchorderPiecesTest({ currPage, perpage, chainTestId });
  }, [currPage, perpage, chainTestId, status]);

  useEffect(() => {
    if (status === "open") {
      socket?.on("new-order-placed-test", (msg: IMarketOrderPieceTestRecord) => {
        // setPieces([msg, ...pieces]);
        setPieces([msg, ...pieces]);
        setTotalItems(totalItems + 1);
      });
      return () => {
        socket?.off("new-order-placed-test");
      };
    }
  }, [status, pieces, totalItems]);

  useEffect(() => {
    if (status === "open") {
      socket?.on("bot-quit-test", (msg) => {
        toast.info(msg);
        bot.onToggle(false);
        fetchOrderChains();
      });
      return () => {
        socket?.off("bot-quit-test");
      };
    }
  }, [status]);

  return (
    <>
      <BasicTable
        fields={orderPieceFields}
        data={status === "open" ? slicePieces : pieces}
        rowProps={({ direction }) => ({
          sx: {
            backgroundColor: direction === "BUY" ? green["50"] : red["50"],
          },
        })}
      />

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

const StyledText = styled(Typography)(({ theme }) => ({
  textAlign: "left",
  color: "black",
  fontWeight: 500,
  fontSize: 15,
  [theme.breakpoints.up("sm")]: {
    fontSize: 17,
  },
}));
