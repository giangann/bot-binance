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
import { toast } from "react-toastify";
import { BaseInput } from "../../components/Input";
import { BotContext } from "../../context/BotContext";
import { SocketContext } from "../../context/SocketContext";
import { getApi, postApi } from "../../request/request";
import { OrderChainContext } from "../../context/OrderChainContext";

type TNewOrderChain = {
  transaction_size: string;
  percent_to_first_buy: string;
  percent_to_buy: string;
  percent_to_sell: string;
};

const defaultValue: TNewOrderChain = {
  percent_to_first_buy: "1",
  transaction_size: "100",
  percent_to_buy: "5",
  percent_to_sell: "-2.5",
};

export const NewOrderChain = () => {
  const [open, setOpen] = useState(false);
  const socket = useContext(SocketContext);
  const bot = useContext(BotContext);
  const { fetchOrderChains } = useContext(OrderChainContext);
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
      if (response.success) {
        toast.success("Bot kích hoạt thành công, check point mỗi 10s");
        bot.onToggle(true);
        fetchOrderChains();
      } else toast.error(response.error.message);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  const onQuit = async () => {
    const response = await getApi("bot/quit");
    if (response.success) {
      // @ts-ignore
      const { numOfSuccess, numOfFailure } = response.data;
      const msg = `close: ${numOfSuccess} and failure: ${numOfFailure}`;
      toast.success(msg);
      bot.onToggle(false);
      fetchOrderChains();
    } else toast.error(response.error.message);
  };

  console.log("is active", bot.active);

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
        disabled={bot.active}
        endIcon={
          bot.active ? <CircularProgress color="inherit" size={14} /> : ""
        }
      >
        + Kích hoạt BOT
      </Button>

      <Button
        disabled={!bot.active}
        variant="outlined"
        color="error"
        onClick={onQuit}
      >
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
                {...register("transaction_size")}
                label="Giá trị lệnh (USD)"
                placeholder="Nhập số"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("percent_to_first_buy")}
                label="Mua lần đầu khi lãi lớn hơn: (%)"
                placeholder="vd: 1 hoặc 2 hoặc 3 ..."
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
