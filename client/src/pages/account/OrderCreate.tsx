import { Box, Button, Dialog, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BaseInput } from "../../components/Input";

type TNewOrder = {
  trade_size: number;
  double_percent: number;
  stop_percent: number;
};

const defaultValue: TNewOrder = {
  trade_size: 100,
  double_percent: 5,
  stop_percent: 2.5,
};
export const OrderCreate = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<TNewOrder>({
    defaultValues: defaultValue,
  });

  const onCreate = async (values: TNewOrder) => {
    console.log("values ", values);
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        + Tạo lệnh
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
                {...register("trade_size")}
                label="Giá trị lệnh (USD)"
                placeholder="Nhập số"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("double_percent")}
                label="Nhân đôi giá trị khi lãi lớn hơn: (%)"
                placeholder="vd: 5 hoặc 10 hoặc 15 ..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <BaseInput
                {...register("stop_percent")}
                label="Dừng lệnh khi lỗ lớn hơn: (%)"
                placeholder="vd: 2.5 hoặc 5 hoặc 7.5 ..."
              />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={()=>setOpen(false)}>Đóng </Button>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};
