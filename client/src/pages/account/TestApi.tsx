import { Button, Typography } from "@mui/material";
import { getApi } from "../../request/request";
import { toast } from "react-toastify";

export const TestApi = () => {
  const onClick = async () => {
    const response = await getApi("user/acc-info");
    if (response.success) console.log(response.data);
    else toast.error(response.error.message);
  };
  return (
    <Button onClick={onClick}>
      <Typography>Acc Info test</Typography>
    </Button>
  );
};
