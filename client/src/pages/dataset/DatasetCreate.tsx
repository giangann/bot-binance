import { Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { IDatasetCreate } from "../../shared/types/dataset";
import { BaseInput } from "../../components/Input";
import { postApi } from "../../request/request";
import { toast } from "react-toastify";

type Props = {
  fetchDatasets: () => void;
};
export const DatasetCreate: React.FC<Props> = ({ fetchDatasets }) => {
  const { register, handleSubmit, reset } = useForm<IDatasetCreate>();

  const onCreateNewDataset = async (value: IDatasetCreate) => {
    try {
      const response = await postApi("dataset", value);
      if (response.success) {
        // refetch
        fetchDatasets();
        // clear form
        reset();
      } else toast.error(response.error.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <Box mt={6}>
      <Typography>Create new dataset</Typography>

      <Box component={"form"} onSubmit={handleSubmit(onCreateNewDataset)}>
        <BaseInput required {...register("name")} placeholder="type dataset name..." />

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Create
        </Button>
      </Box>
    </Box>
  );
};
