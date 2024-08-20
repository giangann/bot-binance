import CachedIcon from "@mui/icons-material/Cached";
import { Box, Button, CircularProgress, Dialog, IconButton, Skeleton, Stack, Typography, styled } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CustomTable, StrictField } from "../../components/Table/Customtable";
import { SocketContext } from "../../context/SocketContext";
import { getApi, postApi } from "../../request/request";
import { TPosition } from "../../shared/types/position";
import { filterPositionsNotZero, sortPositionByPnl, totalUnrealizedPnl } from "../../ultils/helper";

export const Position = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClosingPos, setIsClosingPos] = useState(false);
  const [openCfDialog, setOpenCfDialog] = useState(false);
  const [positions, setPositions] = useState<TPosition[]>([]);

  const [dialogHandlers, setDialogHandlers] = useState<{ onConfirm: () => void; onCancel: () => void }>({
    onConfirm: () => {},
    onCancel: () => {},
  });

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

  const onCloseAllLongPositions = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setOpenCfDialog(true);

      const handleConfirmDelete = async () => {
        try {
          setIsClosingPos(true);

          const response = await postApi<{ success: number; failure: number }>("my-binance/close-all-long-positions", {});
          if (response.success) {
            const { failure, success } = response.data;
            toast.success(`${success}/${success + failure} positions closed`);
            fetchPosition();
            resolve(true);
          } else {
            toast.error(response.error.message);
            resolve(false);
          }
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setIsClosingPos(false);
          setOpenCfDialog(false);
        }
      };

      const handleCancelDelete = () => {
        setOpenCfDialog(false);
        resolve(false);
      };

      setDialogHandlers({ onConfirm: handleConfirmDelete, onCancel: handleCancelDelete });
    });
  };

  useEffect(() => {
    socket?.on("ws-position-info", (positions: TPosition[]) => {
      setPositions(positions);
    });
    return () => {
      socket?.off("ws-position-info");
    };
  }, []);

  useEffect(() => {
    fetchPosition();
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
      <Stack direction="row" alignItems={"flex-start"} justifyContent={"space-between"}>
        <Stack direction="row" alignItems={"center"}>
          <Typography variant="h6">Your position</Typography>
          <IconButton onClick={fetchPosition}>
            <CachedIcon />
          </IconButton>
        </Stack>
        <Button onClick={onCloseAllLongPositions} variant="contained" color="warning">
          Close All
        </Button>
      </Stack>
      {isLoading && <Skeleton variant="rectangular" width={"100%"} height={"200px"} />}
      {!isLoading && (
        <>
          <Typography>Total Unrealized PNL: {totalUnrealizedPnl(positions).toFixed(3)}</Typography>
          <CustomTable fields={fields} data={sortedPositions} />
        </>
      )}
      <Dialog open={openCfDialog} onClose={dialogHandlers.onCancel}>
        <Box p={4}>
          <Typography variant="h6">Xác nhận đóng tất cả Positions?</Typography>
          <Box mb={2} />

          <Stack direction="row" spacing={1} justifyContent={"flex-end"} alignItems={"center"}>
            <Button onClick={dialogHandlers.onCancel} variant="outlined">
              Close
            </Button>
            <Button
              onClick={dialogHandlers.onConfirm}
              disabled={isClosingPos}
              startIcon={isClosingPos && <CircularProgress color="inherit" size={14} />}
              variant="contained"
            >
              Ok
            </Button>
          </Stack>
        </Box>
      </Dialog>{" "}
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
