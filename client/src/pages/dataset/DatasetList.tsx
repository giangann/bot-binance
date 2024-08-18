import { Box, IconButton, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BackToHomePage } from "../../components/BackHome/BackToHomePage";
import { BasicTable } from "../../components/Table/BasicTable";
import { StrictField } from "../../components/Table/Customtable";
import { getApi } from "../../request/request";
import { IDatasetEntity } from "../../shared/types/dataset";
import { useNavigate } from "react-router-dom";
import MediationIcon from "@mui/icons-material/Mediation";
export const DatasetList = () => {
  const [datasets, setDatasets] = useState<IDatasetEntity[]>([]);
  const navigate = useNavigate();
  const fields: StrictField<IDatasetEntity>[] = [
    {
      header: "ID",
      fieldKey: "id",
      width: 200,
    },
    {
      header: "Name",
      fieldKey: "name",
      width: 200,
    },
    {
      header: "Created At",
      fieldKey: "createdAt",
      width: 200,
      render: ({ createdAt }) => <Typography>{dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}</Typography>,
    },
    {
      header: "Detail",
      width: 100,
      fieldKey: "id",
      render: ({ id }) => (
        <IconButton onClick={() => navigate(`${id}`)}>
          <MediationIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    async function fetchDatasets() {
      const response = await getApi<IDatasetEntity[]>("dataset");
      if (response.success) setDatasets(response.data);
      else toast.error(response.error.message);
    }
    fetchDatasets();
  }, []);
  return (
    <Box>
      <BackToHomePage />
      <Typography>Dataset</Typography>

      <BasicTable data={datasets} fields={fields} />
    </Box>
  );
};
