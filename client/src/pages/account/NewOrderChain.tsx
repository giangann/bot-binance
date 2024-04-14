import { Box, Button, Dialog, Grid, Stack } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BaseInput } from "../../components/Input";
import { postApi } from "../../request/request";

type TNewOrderChain = {
  amount: number;
  side: "buy" | "sell";
  symbol: string;
  interval_time: number; // seconds
  percent_diff_down: number; // %
  percent_diff_up: number; // %
  amount_multi: number;
};

const defaultValue: TNewOrderChain = {
  amount: 0.01,
  side: "buy",
  symbol: "BTCUSDT",
  interval_time: 5,
  percent_diff_down: -2.5,
  percent_diff_up: 5,
  amount_multi: 2,
};

export const NewOrderChain = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<TNewOrderChain>({
    defaultValues: defaultValue,
  });
  const onCreate = async (values: TNewOrderChain) => {
    console.log("values ", values);
    try {
      const response = await postApi<TNewOrderChain>("order-chain", values);
      if (response.success)
        alert(
          "Đặt chuỗi lệnh thành công, đang chạy logic auto binance market order"
        );
      else alert(`Lỗi: ${JSON.stringify(response.error)}`);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        + Đặt chuỗi lệnh
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        component={"form"}
        onSubmit={handleSubmit(onCreate)}
      >
        <Box p={4}>
          <Grid container spacing={2} mb={2}>
            {/* <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("trade_size")}
                label="Giá trị lệnh (USD)"
                placeholder="Nhập số"
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("amount")}
                label="Nhập số lượng tài sản"
                placeholder="vd: 0.01, 0.05, 1 ..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("side")}
                label="Mua hay bán? (buy/sell)"
                placeholder="buy/sell"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("symbol")}
                label="Nhập symbol"
                placeholder="vd BTCUSDT"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("percent_diff_up")}
                label="Đặt 1 lệnh mới khi lãi lớn hơn: (%)"
                placeholder="vd: 5 hoặc 10 hoặc 15 ..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("amount_multi")}
                label="Số lượng gấp ? lần:"
                placeholder="vd: 1, 2.5, 2, ..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("percent_diff_down")}
                label="Dừng lệnh khi lãi thấp hơn: (%)"
                placeholder="vd: -2.5 hoặc -5 hoặc -7.5 ..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("interval_time")}
                label="Quy trình chạy sau mỗi ? giây"
                placeholder="vd: 60, 120, 30..."
              />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Đóng{" "}
            </Button>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};
