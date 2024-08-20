import { Box, Button, CircularProgress, Dialog, Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { OrderChainContext } from "../../context/OrderChainContext";
import { postApi } from "../../request/request";

export const MarkAllChainsTestAsClosed = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCfDialog, setOpenCfDialog] = useState(false);

  const [dialogHandlers, setDialogHandlers] = useState<{ onConfirm: () => void; onCancel: () => void }>({
    onConfirm: () => {},
    onCancel: () => {},
  });

  const { fetchOrderChains } = useContext(OrderChainContext);

  const onMarkAllChainAsClosed = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setOpenCfDialog(true);

      const handleConfirmDelete = async () => {
        try {
          setIsSubmitting(true);

          const response = await postApi<{ message: string }>("order-chain-test/mark-all-open-chain-as-closed", {});
          if (response.success) {
            toast.success(response.data.message);
            fetchOrderChains();
            resolve(true);
          } else {
            toast.error(response.error.message);
            resolve(false);
          }
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setIsSubmitting(false);
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

  return (
    <Box>
      <Button variant="outlined" color="warning" onClick={onMarkAllChainAsClosed}>
        Mark all as closed
      </Button>

      <Dialog open={openCfDialog} onClose={dialogHandlers.onCancel}>
        <Box p={4}>
          <Typography variant="h6">Xác nhận đánh dấu status toàn bộ chain sang 'closed' ?</Typography>
          <Box mb={2} />

          <Stack direction="row" spacing={1} justifyContent={"flex-end"} alignItems={"center"}>
            <Button onClick={dialogHandlers.onCancel} variant="outlined">
              Close
            </Button>
            <Button
              onClick={dialogHandlers.onConfirm}
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress color="inherit" size={14} />}
              variant="contained"
            >
              Ok
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};
