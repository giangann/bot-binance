import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BackToHomePage } from "../../components/BackHome/BackToHomePage";
import { BasicTable } from "../../components/Table/BasicTable";
import { StrictField } from "../../components/Table/Customtable";
import { getApi } from "../../request/request";
import { IDatasetEntity, IDatasetItemRecord } from "../../shared/types/dataset";
export const DatasetDetail = () => {
  const [datasetItems, setDatasetItems] = useState<IDatasetItemRecord[]>([]);
  const params = useParams();
  const datasetId = parseInt(params?.id ?? "0");

  const fields: StrictField<IDatasetItemRecord>[] = [
    {
      header: "Order",
      fieldKey: "order",
      width: 200,
    },
    {
      header: "Symbol",
      fieldKey: "symbol",
      width: 200,
    },
    {
      header: "Ticker_price",
      fieldKey: "ticker_price",
      width: 200,
    },
    {
      header: "Market_price",
      fieldKey: "market_price",
      width: 200,
    },
    {
      header: "Created At",
      fieldKey: "createdAt",
      width: 200,
      render: ({ createdAt }) => <Typography>{dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}</Typography>,
    },
  ];

  useEffect(() => {
    async function fetchDatasets(id: number) {
      const response = await getApi<IDatasetEntity>(`dataset/${id}`);
      if (response.success) setDatasetItems(response.data.dataset_items);
      else toast.error(response.error.message);
    }
    fetchDatasets(datasetId);
  }, [datasetId]);
  return (
    <Box>
      <BackToHomePage />
      <Typography>Dataset</Typography>

      <BasicTable data={datasetItems} fields={fields} />
    </Box>
  );
};
