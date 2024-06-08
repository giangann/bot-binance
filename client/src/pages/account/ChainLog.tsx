import { Box, Stack, Typography, styled } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import dayjs from "dayjs";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/SocketContext";
import { getApi } from "../../request/request";
import { usePagination } from "../../hooks/usePagination";
import { CustomPagi } from "../../components/Table/CustomPagi";
import { TResponseWithPagiSimple } from "../../shared/types/base";

type TLog = {
  id: number;
  market_order_chains_id: number;
  message: string;
  type: string;
  createdAt: string;
  updatedAt: string;
};
export const ChainLog = () => {
  const [logs, setLogs] = useState<TLog[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const socket = useContext(SocketContext);
  const params = useParams();
  const chainId = params?.chainId;

  const pagiData = usePagination({ rows: totalItems });
  const { currPage, perpage } = pagiData;

  const fetchLogs = useCallback(async (currPage: number, perpage: number) => {
    const params = {
      page: `${currPage}`,
      perpage: `${perpage}`,
    };
    const response = await getApi<TResponseWithPagiSimple<TLog[]>>(
      `order-chain/log/${chainId}`,
      params
    );
    if (response.success) {
      setLogs(response.data.data);
      setTotalItems(response.data.pagi.totalItems);
    } else {
      toast.error(response.error.message);
    }
  }, []);

  useEffect(() => {
    fetchLogs(currPage, perpage);
  }, [params, currPage, perpage]);

  //   use for socket fetch realtime
  useEffect(() => {
    socket?.on("err-orders", (nums_of_err_orders: number) => {
      fetchLogs(currPage, perpage);
      toast.warning(`Có ${nums_of_err_orders} lệnh bị lỗi khi thực hiện`);
    });

    return () => {
      socket?.off("err-orders");
    };
  }, [currPage, perpage]);

  return (
    <BlockBox open={false}>
      {!logs.length ? (
        <Typography fontSize={28} textAlign={"center"}>
          No logs
        </Typography>
      ) : (
        <>
          <Logs logs={logs} />
          <CustomPagi totalItems={totalItems} {...pagiData} />
        </>
      )}
    </BlockBox>
  );
};

const Logs = ({ logs }: { logs: TLog[] }) => {
  return (
    <Stack spacing={1}>
      {logs.map((log) => {
        const { market_order_chains_id, type, message, createdAt } = log;
        return (
          <LineBox>
            <Stack
              direction={"row"}
              spacing={2}
              justifyContent={"space-between"}
            >
              <Typography>{market_order_chains_id}</Typography>
              <Typography>{type}</Typography>
              <Typography>{message}</Typography>
              <Typography>
                {dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </Typography>
            </Stack>
          </LineBox>
        );
      })}
    </Stack>
  );
};

const BlockBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open, theme }) => ({
  padding: 16,
  borderRadius: 16,
  backgroundColor: open ? blue["200"] : grey["400"],
  [theme.breakpoints.down("sm")]: {},
}));
const LineBox = styled(Box)(({ theme }) => ({
  padding: 8,
  paddingLeft: 16,
  marginLeft: 8,
  borderRadius: 8,
  backgroundColor: grey["50"],
  [theme.breakpoints.down("sm")]: {},
}));
