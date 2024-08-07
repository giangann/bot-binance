import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Stack,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BaseInput } from "../../components/Input";
import { getApi, putApi } from "../../request/request";
import {
  IAutoActiveConfigEntitywithoutId,
  IAutoActiveConfigUpdateOne,
  TAutoActiveStatus,
} from "../../shared/types/auto-active-config";
import { TOrderChainPriceType } from "../../shared/types/order";

export const AutoActiveConfig = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        Auto Active
      </Button>
      {open && <AutoActiveConfigDialog open={open} setOpen={setOpen} />}
    </>
  );
};

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
export const AutoActiveConfigDialog: React.FC<Props> = ({ open, setOpen }) => {
  const [priceType, setPriceType] = useState<TOrderChainPriceType>("ticker");
  const [autoActive, setAutoActive] = useState<TAutoActiveStatus>("off");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<IAutoActiveConfigUpdateOne>();

  const onUpdate = async (values: IAutoActiveConfigUpdateOne) => {
    try {
      const params: IAutoActiveConfigUpdateOne = {
        ...values,
        price_type: priceType,
        auto_active: autoActive,
      };

      const response = await putApi("config/update-one", params);
      if (response.success) {
        toast.success("Update success");
      } else {
        toast.error(response.error.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    async function fetchConfig() {
      setIsLoading(true);
      const response = await getApi<IAutoActiveConfigEntitywithoutId>(
        "config/get-one"
      );
      if (response.success) {
        const {
          auto_active,
          auto_active_decrease_price,
          max_pnl_start,
          max_pnl_threshold_to_quit,
          percent_to_buy,
          percent_to_first_buy,
          percent_to_sell,
          pnl_to_stop,
          price_type,
          transaction_size_start,
        } = response.data;
        setValue("auto_active_decrease_price", auto_active_decrease_price);
        setValue("max_pnl_start", max_pnl_start);
        setValue("max_pnl_threshold_to_quit", max_pnl_threshold_to_quit);
        setValue("percent_to_buy", percent_to_buy);
        setValue("percent_to_first_buy", percent_to_first_buy);
        setValue("percent_to_sell", percent_to_sell);
        setValue("pnl_to_stop", pnl_to_stop);
        setValue("transaction_size_start", transaction_size_start);

        setPriceType(price_type);
        setAutoActive(auto_active);
      } else {
        toast.error(response.error.message);
      }
      setIsLoading(false);
    }
    fetchConfig();
  }, []);
  return (
    <Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        component={"form"}
        onSubmit={handleSubmit(onUpdate)}
      >
        <Box p={4}>
          {isLoading && "Loading..."}
          {!isLoading && (
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={6}>
                <BaseInput
                  {...register("auto_active_decrease_price")}
                  label="Điều kiện kích hoạt (USD)"
                  placeholder="Nhập số"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <BaseInput
                  {...register("transaction_size_start")}
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
              <Grid item xs={12} sm={6}>
                <BaseInput
                  {...register("pnl_to_stop")}
                  label="Đóng lệnh khi pnl nhỏ hơn: ($)"
                  placeholder="vd: 20, -10, ..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <BaseInput
                  {...register("max_pnl_start")}
                  label="Max Pnl start ($)"
                  placeholder="vd: 20, 30,... (greater than 0)"
                />
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
                  <FormLabel id="price_type">Chọn kiểu giá</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="price_type"
                    onChange={(ev) =>
                      setPriceType(ev.target.value as TOrderChainPriceType)
                    }
                    value={priceType}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label="Ticker"
                      value={"ticker"}
                    />
                    <FormControlLabel
                      control={<Radio />}
                      label="Market"
                      value={"market"}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel id="auto_active">Tự động kích hoạt</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="auto_active"
                    onChange={(ev) =>
                      setAutoActive(ev.target.value as TAutoActiveStatus)
                    }
                    value={autoActive}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label="Off"
                      value={"off"}
                    />
                    <FormControlLabel
                      control={<Radio />}
                      label="On"
                      value={"on"}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          )}

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
