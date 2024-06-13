import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { getApi } from "../../request/request";

export const UpdateCoinPrice = () => {
  const [showCfModal, setShowCfModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = () => setShowCfModal(false);
  const onOpen = () => setShowCfModal(true);
  const onAccept = async () => {
    try {
      setIsSubmitting(true);
      const response = await getApi("coin/update-price");
      if (response.success) toast.success("Update success");
      else toast.error(response.error.message);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Box mt={6}>
      <Button
        variant={"contained"}
        color={"warning"}
        onClick={onOpen}
        disabled={isSubmitting}
        endIcon={isSubmitting && <CircularProgress color="inherit" size={14} />}
      >
        Cập nhật giá
      </Button>

      <Dialog open={showCfModal} onClose={onClose}>
        <Box p={2}>
          <Typography mb={1} variant="h6">
            Cập nhật giá
          </Typography>
          <Typography mb={2}>
            Xác nhận cập nhật bảng giá, cập nhật sẽ mất thời gian khoảng 10 giây
          </Typography>
          <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
            <Button variant={"outlined"} onClick={onClose}>
              Close
            </Button>
            <Button
              variant={"contained"}
              color={"warning"}
              onClick={onAccept}
              disabled={isSubmitting}
              endIcon={
                isSubmitting && <CircularProgress color="inherit" size={14} />
              }
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};
