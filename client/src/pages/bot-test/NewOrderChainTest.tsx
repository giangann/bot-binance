import { Box, Button, CircularProgress, Dialog, Grid, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BaseInput, InputLabelText } from "../../components/Input";
import { BotContext } from "../../context/BotContext";
import { OrderChainContext } from "../../context/OrderChainContext";
import { getApi, postApi } from "../../request/request";
import { IDatasetRecord } from "../../shared/types/dataset";
import { TOrderChainPriceType } from "../../shared/types/order";

export const NewOrderChainTest = () => {
  const [open, setOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const bot = useContext(BotContext);

  const onQuit = async () => {
    setIsDeactivating(true);
    try {
      const response = await postApi<{ message: string }>("bot/test/deactivate", {});
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

      {open && <NewOrderChainTestDialog open={open} setOpen={setOpen} />}
    </Box>
  );
};

type TNewOrderChainTest = {
  transaction_size_start: string;
  percent_to_first_buy: string;
  percent_to_buy: string;
  percent_to_sell: string;
  pnl_to_stop: string;
  max_pnl_start: string;
  max_pnl_threshold_to_quit: string;
  price_type: TOrderChainPriceType;
  datasets_id: number;
};

const defaultValue: TNewOrderChainTest = {
  percent_to_first_buy: "5",
  transaction_size_start: "53000",
  percent_to_buy: "5",
  percent_to_sell: "-2.5",
  pnl_to_stop: "-100",
  max_pnl_start: "1000",
  max_pnl_threshold_to_quit: "0.6",
  price_type: "market",
  datasets_id: 0,
};

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
const NewOrderChainTestDialog: React.FC<Props> = ({ open, setOpen }) => {
  const [datasets, setDatasets] = useState<IDatasetRecord[]>([]);
  const [datasetId, setDatasetId] = useState<number>(0);

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setDatasetId(event.target.value as unknown as number);
  };

  const [priceType, setPriceType] = useState<TOrderChainPriceType>("market");
  const bot = useContext(BotContext);

  const { fetchOrderChains } = useContext(OrderChainContext);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TNewOrderChainTest>({
    defaultValues: defaultValue,
  });

  const fetchDatasets = useCallback(async () => {
    const response = await getApi<IDatasetRecord[]>("dataset");
    if (response.success) {
      setDatasets(response.data);
    } else {
      toast.error(response.error.message);
    }
  }, []);

  const onCreate = async (values: TNewOrderChainTest) => {
    values["price_type"] = priceType;
    values["datasets_id"] = datasetId;
    try {
      const response = await postApi<{ message: string }>("bot/test/activate", values);
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

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
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
            <BaseInput {...register("max_pnl_threshold_to_quit")} label="Max Pnl Threshold To Quit" placeholder="vd: 0.5, 0.6, 0.7... (>0 and <1)" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabelText id="demo-simple-select-label">Choose dataset</InputLabelText>
              <Select
                labelId="dataset-select-label"
                id="dataset-select"
                defaultValue="Choose dataset"
                // @ts-ignore
                value={datasetId}
                label="Dataset"
                onChange={handleChange}
              >
                {datasets.map((dtset) => (
                  <MenuItem value={dtset.id}>{dtset.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
          <Button variant="contained" type="submit" disabled={isSubmitting} endIcon={isSubmitting && <CircularProgress color="inherit" size={14} />}>
            Submit
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};
