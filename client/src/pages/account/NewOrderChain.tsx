import { Box, Button, CircularProgress, Dialog, Grid, Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BaseInput } from "../../components/Input";
import { BotContext } from "../../context/BotContext";
import { OrderChainContext } from "../../context/OrderChainContext";
import { SocketContext } from "../../context/SocketContext";
import { postApi } from "../../request/request";
import { TOrderChainPriceType } from "../../shared/types/order";

type TNewOrderChain = {
  transaction_size_start: string;
  percent_to_first_buy: string;
  percent_to_buy: string;
  percent_to_sell: string;
  pnl_to_stop: string;
  max_pnl_start: string;
  max_pnl_threshold_to_quit: string;
  price_type: TOrderChainPriceType;
};

const defaultValue: TNewOrderChain = {
  percent_to_first_buy: "1",
  transaction_size_start: "100",
  percent_to_buy: "0",
  percent_to_sell: "0",
  pnl_to_stop: "-10",
  max_pnl_start: "20",
  max_pnl_threshold_to_quit: "0.6",
  price_type: "market",
};

export const NewOrderChain = () => {
  const [open, setOpen] = useState(false);
  const [priceType, setPriceType] = useState<TOrderChainPriceType>("market");
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
    values["price_type"] = priceType;
    console.log("values ", values);
    try {
      const response = await postApi<{ message: string }>("bot/activate", values);
      if (response.success) {
        toast.success(response.data.message);
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
    const response = await postApi<{ message: string }>("bot/deactivate", {});
    if (response.success) {
      toast.success(response.data.message);
      bot.onToggle(false);
      fetchOrderChains();
    } else toast.error(response.error.message);
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
        disabled={bot.active}
        endIcon={bot.active ? <CircularProgress color="inherit" size={14} /> : ""}
      >
        + Kích hoạt BOT
      </Button>

      <Button disabled={!bot.active} variant="outlined" color="error" onClick={onQuit}>
        x Quit
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} component={"form"} onSubmit={handleSubmit(onCreate)}>
        <Box p={4}>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <BaseInput {...register("transaction_size_start")} label="Giá trị lệnh (USD)" placeholder="Nhập số" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput {...register("percent_to_first_buy")} label="Mua lần đầu khi lãi lớn hơn: (%)" placeholder="vd: 1 hoặc 2 hoặc 3 ..." />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput {...register("percent_to_buy")} label="Mua khi lãi lớn hơn: (%)" placeholder="vd: 5 hoặc 10 hoặc 15 ..." />
            </Grid>

            <Grid item xs={12} sm={6}>
              <BaseInput {...register("percent_to_sell")} label="Bán khi lỗ thấp hơn: (%)" placeholder="vd: -5 ... (nhỏ hơn 0)" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput {...register("pnl_to_stop")} label="Đóng lệnh khi pnl nhỏ hơn: ($)" placeholder="vd: 20, -10, ..." />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput {...register("max_pnl_start")} label="Max Pnl start ($)" placeholder="vd: 20, 30,... (greater than 0)" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("max_pnl_threshold_to_quit")}
                label="Max Pnl Threshold To Quit"
                placeholder="vd: 0.5, 0.6, 0.7... (>0 and <1)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">Chọn kiểu giá</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  onChange={(ev) => setPriceType(ev.target.value as TOrderChainPriceType)}
                  value={priceType}
                >
                  {/* <FormControlLabel control={<Radio />} label="Ticker" value={"ticker"} /> */}
                  <FormControlLabel control={<Radio />} label="Market" value={"market"} />
                </RadioGroup>
              </FormControl>
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
              endIcon={isSubmitting && <CircularProgress color="inherit" size={14} />}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};
