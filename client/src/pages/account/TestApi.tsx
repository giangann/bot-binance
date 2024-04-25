import { Button, Stack, Typography } from "@mui/material";
import { getApi } from "../../request/request";
import { toast } from "react-toastify";

export const TestApi = () => {
  const onClickAxios = async () => {
    const response = await getApi("user/acc-info-axios");
    if (response.success) console.log(response.data);
    else toast.error(response.error.message);
  };

  const onClickFetch = async () => {
    const response = await getApi("user/acc-info-fetch");
    if (response.success) console.log(response.data);
    else toast.error(response.error.message);
  };
  return (
    <Stack direction={"row"}>
      <Button onClick={onClickAxios}>
        <Typography>Acc Info test axios</Typography>
      </Button>
      <Button onClick={onClickFetch}>
        <Typography>Acc Info test fetch</Typography>
      </Button>
    </Stack>
  );
};
