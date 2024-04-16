import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Stack,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BaseInput } from "../../components/Input";
import { getApi, postApi } from "../../request/request";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/SocketContext";

type TNewOrderChain = {
  symbol: string;
  transaction_size: string;
  transaction_increase: string;
  percent_to_buy: string;
  percent_to_sell: string;
};

const defaultValue: TNewOrderChain = {
  symbol: "BTCUSDT",
  transaction_size: "100",
  transaction_increase: "100",
  percent_to_buy: "5",
  percent_to_sell: "-2.5",
};

export const NewOrderChain = () => {
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const socket = useContext(SocketContext);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TNewOrderChain>({
    defaultValues: defaultValue,
  });
  const onCreate = async (values: TNewOrderChain) => {
    console.log("values ", values);
    try {
      const response = await postApi<TNewOrderChain>("bot/active", values);
      if (response.success)
        toast.success("Bot kích hoạt thành công, check point mỗi 5s");
      else toast.error(response.error.message);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
      setDisabled(true);
    }
  };

  const onQuit = async () => {
    const response = await getApi("bot/quit");
    if (response.success)
      toast.info("Bot đã được dừng lại và thoát, hãy load lại trang");
    else toast.error(response.error.message);
  };

  useEffect(() => {
    socket?.on("bot-running", (msg) => {
      toast.info(msg);
    });
    return () => {
      socket?.off("bot-running");
    };
  }, []);

  useEffect(() => {
    socket?.on("bot-err", (errMsg) => {
      toast.error(errMsg);
    });
    return () => {
      socket?.off("bot-ert");
    };
  }, []);
  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        disabled={disabled}
        endIcon={disabled && <CircularProgress color="inherit" size={14} />}
      >
        + Kích hoạt BOT
      </Button>

      <Button variant="outlined" color="error" onClick={onQuit}>
        x Quit
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        component={"form"}
        onSubmit={handleSubmit(onCreate)}
      >
        <Box p={4}>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("symbol")}
                label="Nhập symbol"
                placeholder="vd BTCUSDT"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("transaction_size")}
                label="Giá trị lệnh (USD)"
                placeholder="Nhập số"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("transaction_increase")}
                label="Giá trị tăng khi lãi"
                placeholder="Nhập số"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("percent_to_buy")}
                label="Mua khi lãi lớn hơn: (%)"
                placeholder="vd: 5 hoặc 10 hoặc 15 ..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("percent_to_sell")}
                label="Bán khi lỗ thấp hơn: (%)"
                placeholder="vd: -5 ... (nhỏ hơn 0)"
              />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Đóng{" "}
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              endIcon={
                isSubmitting && <CircularProgress color="inherit" size={14} />
              }
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};
