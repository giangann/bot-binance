import CachedIcon from "@mui/icons-material/Cached";
import { useCallback, useContext, useEffect, useState } from "react";
import { getApi } from "../../request/request";
import { TPosition } from "../../shared/types/position";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/SocketContext";
import { Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { StrictField } from "../../components/Table/Customtable";
import { CustomTable } from "../../components/Table/Customtable";
import { sortPositionByPnl } from "../../ultils/helper";

export const Position = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState<TPosition[]>([]);
  const sortedPositions = sortPositionByPnl(positions);
  const socket = useContext(SocketContext);

  const fetchPosition = useCallback(async () => {
    setIsLoading(true);
    const response = await getApi<TPosition[]>("user/position-info");
    if (response.success) {
      setPositions(response.data);
    } else toast.error(response.error.message);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    socket?.on("ws-position", (positions: TPosition[]) => {
      setPositions(positions);
    });
    return () => {
      socket?.off("ws-position");
    };
  }, []);

  const fields: StrictField<TPosition>[] = [
    {
      header: "Symbol",
      fieldKey: "symbol",
      width: 300,
    },
    {
      header: "Size",
      fieldKey: "positionAmt",
      width: 300,
    },
    {
      header: "Entry Price",
      fieldKey: "entryPrice",
      width: 300,
    },
    {
      header: "Mark Price",
      fieldKey: "markPrice",
      width: 300,
    },
    {
      header: "Unrealized PNL",
      fieldKey: "unRealizedProfit",
      width: 300,
      render: ({ unRealizedProfit }) => {
        const pnl = parseFloat(unRealizedProfit);
        let color = "";
        if (pnl > 0) color = "green";
        if (pnl < 0) color = "red";
        return <Typography color={color}>{pnl.toFixed(2)}{' usdt'}</Typography>;
      },
    },
  ];
  return (
    <Box>
      <Stack direction="row" alignItems={"center"}>
        <Typography variant="h6">Your position</Typography>
        <IconButton onClick={fetchPosition}>
          <CachedIcon />
        </IconButton>
      </Stack>
      {isLoading && (
        <Skeleton variant="rectangular" width={"100%"} height={"200px"} />
      )}
      {!isLoading && <CustomTable fields={fields} data={sortedPositions} />}
    </Box>
  );
};
