import CachedIcon from "@mui/icons-material/Cached";
import { useCallback, useContext, useEffect, useState } from "react";
import { getApi } from "../../request/request";
import { TPosition } from "../../shared/types/position";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/SocketContext";
import { Box, IconButton, Skeleton, Stack, Typography, styled } from "@mui/material";
import { StrictField } from "../../components/Table/Customtable";
import { CustomTable } from "../../components/Table/Customtable";
import { filterPositionsNotZero, sortPositionByPnl, totalUnrealizedPnl } from "../../ultils/helper";

export const Position = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState<TPosition[]>([]);

  const filterZeroPositions = filterPositionsNotZero(positions);
  const sortedPositions = sortPositionByPnl(filterZeroPositions);

  const socket = useContext(SocketContext);

  const fetchPosition = useCallback(async () => {
    setIsLoading(true);
    const response = await getApi<TPosition[]>("my-binance/position-info");
    if (response.success) {
      setPositions(response.data);
    } else toast.error(response.error.message);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    socket?.on("ws-position-info", (positions: TPosition[]) => {
      setPositions(positions);
    });
    return () => {
      socket?.off("ws-position-info");
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
      width: 200,
    },
    {
      header: "Entry Price",
      fieldKey: "entryPrice",
      width: 300,
      render: ({ entryPrice }) => <StyledText>{parseFloat(entryPrice).toFixed(5)}</StyledText>,
    },
    {
      header: "Mark Price",
      fieldKey: "markPrice",
      width: 300,
      render: ({ markPrice }) => <StyledText>{parseFloat(markPrice).toFixed(5)}</StyledText>,
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
        return (
          <Typography display={"inline"} color={color}>
            {pnl.toFixed(2)}
            {" usdt"}
          </Typography>
        );
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
      {isLoading && <Skeleton variant="rectangular" width={"100%"} height={"200px"} />}
      {!isLoading && (
        <>
          <Typography>Total Unrealized PNL: {totalUnrealizedPnl(positions).toFixed(3)}</Typography>
          <CustomTable fields={fields} data={sortedPositions} />
        </>
      )}
    </Box>
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
