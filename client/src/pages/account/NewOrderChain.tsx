import { Box, Button, CircularProgress, Dialog, Grid, Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BaseInput } from "../../components/Input";
import { BotContext } from "../../context/BotContext";
import { OrderChainContext } from "../../context/OrderChainContext";
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
  symbol_max_pnl_start: string;
  symbol_max_pnl_threshold: string;
  symbol_pnl_to_cutloss: string;
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
  symbol_max_pnl_start: "5",
  symbol_max_pnl_threshold: "0.8",
  symbol_pnl_to_cutloss: "-5",
  price_type: "market",
};

export const NewOrderChain = () => {
  const [open, setOpen] = useState(false);
  const [priceType, setPriceType] = useState<TOrderChainPriceType>("market");
  const [isDeactivating, setIsDeactivating] = useState(false);

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
    setIsDeactivating(true);
    try {
      const response = await postApi<{ message: string }>("bot/deactivate", {});
      // if (response.success) {
      //   toast.success(response.data.message);
      //   bot.onToggle(false);
      //   fetchOrderChains();
      // } else toast.error(response.error.message);
      if (!response.success) toast.error(response.error.message);
    } catch (error: any) {
    } finally {
      setIsDeactivating(false);
    }
  };

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

      <Button disabled={!bot.active || isDeactivating} variant="outlined" color="error" onClick={onQuit}>
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
              <BaseInput {...register("pnl_to_stop")} label="Dừng bot khi total pnl nhỏ hơn: ($)" placeholder="vd: 20, -10, ..." />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput {...register("max_pnl_start")} label="Max Total Pnl start ($)" placeholder="vd: 20, 30,... (greater than 0)" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("max_pnl_threshold_to_quit")}
                label="Max Total Pnl Threshold To Quit"
                placeholder="vd: 0.5, 0.6, 0.7... (>0 and <1)"
              />
            </Grid>
            <Grid item xs={12} sm={6} />
            <Grid item xs={12} sm={6}>
              <BaseInput {...register("symbol_pnl_to_cutloss")} label="Cắt lỗ vị thế khi pnl nhỏ hơn: ($)" placeholder="vd: 20, -10, ..." />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput {...register("symbol_max_pnl_start")} label="Max Pnl Start vị thế ($)" placeholder="vd: 20, 30,... (greater than 0)" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput {...register("symbol_max_pnl_threshold")} label="Chốt lãi vị thế threshold" placeholder="vd: 0.5, 0.6, 0.7... (>0 and <1)" />
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
