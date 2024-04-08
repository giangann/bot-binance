import {
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { IcBaselineSettings, IcRoundPlus } from "../../icons/Icons";
import { BaseInput } from "../../components/Input";
import { useForm } from "react-hook-form";
export const Setting = () => {
  const [openSetting, setOpenSetting] = useState(false);
  return (
    <>
      <IconButton onClick={() => setOpenSetting(true)}>
        <IcBaselineSettings />
      </IconButton>
      <Dialog
        open={openSetting}
        onClose={() => setOpenSetting(false)}
        maxWidth="sm"
      >
        <Box sx={{ position: "relative" }}>
          <SettingFields />
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={() => setOpenSetting(false)}
          >
            <IcRoundPlus style={{ transform: "rotate(45deg)" }} />
          </IconButton>
        </Box>
      </Dialog>
    </>
  );
};

type TSetting = {
  loss_max: number;
  trade_size: number;
};

export const SettingFields = () => {
  const { register, formState, handleSubmit } = useForm<TSetting>();
  const onSubmit = (value: TSetting) => {
    console.log("value", value);
  };
  return (
    <Box p={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" mb={2}>
        Setting
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6}>
          <BaseInput
            {...register("trade_size")}
            placeholder="trade size = ?"
            label="Giá trị lệnh"
            required
            err={formState.errors.trade_size?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <BaseInput
            {...register("trade_size")}
            placeholder="loss max = ?"
            label="Lỗ tối đa"
            required
            err={formState.errors.trade_size?.message}
          />
        </Grid>
      </Grid>
      <Button variant="contained" type="submit">
        Lưu
      </Button>
    </Box>
  );
};
