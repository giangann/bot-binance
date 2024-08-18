import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { Box, Button, IconButton, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BackToHomePage } from "../../components/BackHome/BackToHomePage";
import { BasicTable } from "../../components/Table/BasicTable";
import { StrictField } from "../../components/Table/Customtable";
import { getApi, patchApi } from "../../request/request";
import { IDatasetCreate, IDatasetEntity, IDatasetItemRecord, IDatasetItemUpdate, IDatasetUpdate } from "../../shared/types/dataset";
import { useFieldArray, useForm } from "react-hook-form";
import { BaseInput } from "../../components/Input";

export const DatasetDetail = () => {
  const [dataset, setDataset] = useState<IDatasetEntity | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const datasetItems = dataset?.dataset_items ?? [];

  const toEditMode = () => setIsEdit(true);
  const toViewMode = () => setIsEdit(false);
  const onToggle = isEdit ? toViewMode : toEditMode;

  const params = useParams();
  const datasetId = parseInt(params?.id ?? "0");

  const onDeleteItem = (id: number) => {
    alert(`Item ${id} deleted !`);
  };

  // const fetchDatasets = useCallback(async () => {
  //   const response = await getApi<IDatasetEntity>(`dataset/${datasetId}`);
  //   if (response.success) {
  //     setDataset(response.data);
  //   } else toast.error(response.error.message);
  // }, [datasetId]);

  const fetchDatasets = useCallback(async () => {
    async function fetchDetail(id: number) {
      const response = await getApi<IDatasetEntity>(`dataset/${id}`);
      if (response.success) {
        setDataset(response.data);
      } else toast.error(response.error.message);
    }
    fetchDetail(datasetId);
  }, [datasetId]);

  const onSaveEdit = async (_value: IDatasetCreate | IDatasetUpdate) => {
    try {
      // get statistic
      const { isDirty, dirtyFields } = formState;

      // initial request params
      const patchParams: IDatasetCreate | IDatasetUpdate = {
        id: datasetId,
      };

      // add dirty field to params
      const dirtyFieldsKeys = Object.keys(dirtyFields);
      for (const key of dirtyFieldsKeys) {
        if (key !== "dataset_items") {
          // @ts-ignore
          const newValue = getValues(key);
          // @ts-ignore
          patchParams[key] = newValue;
        }
      }

      // the dataset_items is except and get handle below
      // filter out null el
      const updatedItems = dirtyFields.dataset_items
        ?.map((item, index) => {
          const newObject: IDatasetItemUpdate = { id: index };
          // get all keys have modify
          const itemKeys = Object.keys(item);
          for (const key of itemKeys) {
            // @ts-ignore
            const value = getValues(`dataset_items.${index}.${key}`); // get new value
            const newValue = value || null; // validate if "" => null
            // @ts-ignore
            newObject[key] = newValue;
          }

          return newObject;
        })
        .filter((item) => item);

      if (updatedItems) patchParams.dataset_items = updatedItems;

      console.log({ isDirty, dirtyFields, updatedItems, patchParams });

      // send patchParams with request
      const { id, ...otherParams } = patchParams;
      const response = await patchApi(`dataset/${datasetId}`, otherParams);

      if (response.success) toast.error("Update success");
      else toast.error(response.error.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      onToggle();
      fetchDatasets();
    }
  };

  const { control, handleSubmit, register, setValue, formState, getValues } = useForm<IDatasetCreate | IDatasetUpdate>();

  const fields: StrictField<IDatasetItemRecord>[] = [
    {
      header: "Order",
      fieldKey: "order",
      render: ({ id, order }) => {
        return (
          <>
            {!isEdit && <Typography>{order}</Typography>}
            {isEdit && <BaseInput {...register(`dataset_items.${id}.order`)} defaultValue={order} />}
          </>
        );
      },
    },
    {
      header: "Symbol",
      fieldKey: "symbol",
      render: ({ id, symbol }) => {
        return (
          <>
            {!isEdit && <Typography>{symbol}</Typography>}
            {isEdit && <BaseInput {...register(`dataset_items.${id}.symbol`)} defaultValue={symbol} />}
          </>
        );
      },
    },
    {
      header: "Ticker_price",
      fieldKey: "ticker_price",
      render: ({ id, ticker_price }) => {
        return (
          <>
            {!isEdit && <Typography>{ticker_price}</Typography>}
            {isEdit && <BaseInput {...register(`dataset_items.${id}.ticker_price`)} defaultValue={ticker_price} />}
          </>
        );
      },
    },
    {
      header: "Market_price",
      fieldKey: "market_price",
      render: ({ id, market_price }) => {
        return (
          <>
            {!isEdit && <Typography>{market_price}</Typography>}
            {isEdit && <BaseInput {...register(`dataset_items.${id}.market_price`)} defaultValue={market_price} />}
          </>
        );
      },
    },
    {
      header: "Created At",
      fieldKey: "createdAt",
      render: ({ createdAt }) => <Typography>{dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}</Typography>,
    },
    {
      header: "Delete",
      width: 100,
      fieldKey: "id",
      render: ({ id }) => (
        <IconButton onClick={() => onDeleteItem(id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    fetchDatasets();
  }, [datasetId]);
  return (
    <Box>
      <BackToHomePage />
      <Typography>Dataset</Typography>

      <Box component="form" onSubmit={handleSubmit(onSaveEdit)}>
        {!isEdit && (
          <Button onClick={onToggle} startIcon={<EditNoteIcon />}>
            Edit
          </Button>
        )}

        {isEdit && (
          <Button onClick={onToggle} variant="outlined" color="inherit" startIcon={<NotInterestedIcon />} sx={{ mr: 2 }}>
            Cancel
          </Button>
        )}
        {isEdit && <></>}
        <Button type="submit" variant="contained" color="warning" disabled={!isEdit || !formState.isDirty}>
          Save
        </Button>

        <>
          {!isEdit && <Typography>{dataset?.name ?? "No data"}</Typography>}
          {isEdit && <BaseInput {...register("name")} defaultValue={dataset?.name} />}
        </>
        <BasicTable data={datasetItems} fields={fields} />
      </Box>
    </Box>
  );
};
