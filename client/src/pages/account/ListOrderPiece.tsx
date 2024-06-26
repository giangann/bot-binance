// take first time render pieces from parent
// define method when pagination currentPage change

import { Typography, styled } from "@mui/material";
import { green, red } from "@mui/material/colors";
import dayjs from "dayjs";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { BasicTable } from "../../components/Table/BasicTable";
import { CustomPagi } from "../../components/Table/CustomPagi";
import { StrictField } from "../../components/Table/Customtable";
import { BotContext } from "../../context/BotContext";
import { OrderChainContext } from "../../context/OrderChainContext";
import { SocketContext } from "../../context/SocketContext";
import { usePagination } from "../../hooks/usePagination";
import { TPagiApiShort, getApi } from "../../request/request";
import {
  IMarketOrderPieceRecord,
  TMarketOrderChainWithPiecesPagi,
  TOrderChainStatus,
} from "../../shared/types/order";

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
      render: ({ transaction_size }) => (
        <StyledText>{parseFloat(transaction_size).toFixed(3)}</StyledText>
      ),
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
      render: ({ percent_change }) => (
        <StyledText>{parseFloat(percent_change).toFixed(2)}%,</StyledText>
      ),
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
      render: ({ createdAt }) => (
        <StyledText>
          {dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}
        </StyledText>
      ),
      width: 400,
    },
  ];

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
      <BasicTable
        fields={orderPieceFields}
        data={pieces}
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
