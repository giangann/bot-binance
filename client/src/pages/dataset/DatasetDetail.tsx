import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BackToHomePage } from "../../components/BackHome/BackToHomePage";
import { BaseInput } from "../../components/Input";
import { BasicTable, DEFAULT_CELL_WIDTH } from "../../components/Table/BasicTable";
import { StrictField } from "../../components/Table/Customtable";
import { deleteApi, getApi, patchApi } from "../../request/request";
import {
  IDatasetEntity,
  IDatasetItemCreate,
  IDatasetItemRecord,
  IDatasetUpdateCreateItems,
  IDatasetUpdateModifyItems,
} from "../../shared/types/dataset";

export const DatasetDetail = () => {
  const [dataset, setDataset] = useState<IDatasetEntity | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openCfDialog, setOpenCfDialg] = useState(false);
  const [dialogHandlers, setDialogHandlers] = useState<{ onConfirm: () => void; onCancel: () => void }>({
    onConfirm: () => {},
    onCancel: () => {},
  });
  const datasetItems = dataset?.dataset_items ?? [];
  const params = useParams();
  const datasetId = parseInt(params?.id ?? "0");

  const toEditMode = () => setIsEdit(true);
  const toViewMode = () => setIsEdit(false);
  const onToggle = isEdit ? toViewMode : toEditMode;

  const fetchDatasets = useCallback(async () => {
    const response = await getApi<IDatasetEntity>(`dataset/${datasetId}`);
    if (response.success) {
      setDataset(response.data);
    } else toast.error(response.error.message);
  }, [datasetId]);

  const onDeleteItem = async (itemId: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setOpenCfDialg(true);

      const handleConfirmDelete = async () => {
        try {
          setIsDeleting(true);

          const response = await deleteApi(`dataset-item/${itemId}`);
          if (response.success) {
            toast.success("Delete succeeded!");
            fetchDatasets();
            resolve(true);
          } else {
            toast.error(response.error.message);
            resolve(false);
          }
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setIsDeleting(false);
          setOpenCfDialg(false);
        }
      };

      const handleCancelDelete = () => {
        setOpenCfDialg(false);
        resolve(false);
      };

      setDialogHandlers({ onConfirm: handleConfirmDelete, onCancel: handleCancelDelete });
    });
  };

  const handleDeleteClick = async (itemId: number) => {
    const shouldDelete = await onDeleteItem(itemId);
    if (shouldDelete) {
      // Additional logic after successful deletion, if needed
    }
  };

  const onSaveEdit = async (_value: IDatasetUpdateModifyItems) => {
    try {
      const { dirtyFields } = formState;
      const patchParams: IDatasetUpdateModifyItems = { id: datasetId };

      const dirtyFieldsKeys = Object.keys(dirtyFields);
      for (const key of dirtyFieldsKeys) {
        if (key !== "dataset_items") {
          // @ts-ignore
          const newValue = getValues(key);
          // @ts-ignore
          patchParams[key] = newValue;
        }
      }

      const updatedItems = dirtyFields.dataset_items
        ?.map((item, index) => {
          const newObject: IDatasetUpdateModifyItems = { id: index };
          const itemKeys = Object.keys(item);
          for (const key of itemKeys) {
            // @ts-ignore
            const value = getValues(`dataset_items.${index}.${key}`);
            const newValue = value || null;
            // @ts-ignore
            newObject[key] = newValue;
          }
          return newObject;
        })
        .filter((item) => item);

      if (updatedItems) patchParams.dataset_items = updatedItems;

      const { id, ...otherParams } = patchParams;
      const response = await patchApi(`dataset/${datasetId}`, otherParams);

      if (response.success) toast.success("Update success");
      else toast.error(response.error.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      onToggle();
      fetchDatasets();
    }
  };

  const { handleSubmit, register, formState, getValues } = useForm<IDatasetUpdateModifyItems>();

  const fields: StrictField<IDatasetItemRecord>[] = [
    {
      header: "Order",
      fieldKey: "order",
      render: ({ id, order }) => {
        return !isEdit ? <Typography>{order}</Typography> : <BaseInput {...register(`dataset_items.${id}.order`)} defaultValue={order} />;
      },
    },
    {
      header: "Symbol",
      fieldKey: "symbol",
      render: ({ id, symbol }) => {
        return !isEdit ? <Typography>{symbol}</Typography> : <BaseInput {...register(`dataset_items.${id}.symbol`)} defaultValue={symbol} />;
      },
    },
    {
      header: "Ticker_price",
      fieldKey: "ticker_price",
      render: ({ id, ticker_price }) => {
        return !isEdit ? (
          <Typography>{ticker_price}</Typography>
        ) : (
          <BaseInput {...register(`dataset_items.${id}.ticker_price`)} defaultValue={ticker_price} />
        );
      },
    },
    {
      header: "Market_price",
      fieldKey: "market_price",
      render: ({ id, market_price }) => {
        return !isEdit ? (
          <Typography>{market_price}</Typography>
        ) : (
          <BaseInput {...register(`dataset_items.${id}.market_price`)} defaultValue={market_price} />
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
        <IconButton onClick={() => handleDeleteClick(id)}>
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
      <Typography>Dataset Detail - ID:{datasetId}</Typography>

      <Box component="form" onSubmit={handleSubmit(onSaveEdit)}>
        <Box my={2}>
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
          <Button type="submit" variant="contained" color="warning" disabled={!isEdit || !formState.isDirty}>
            Save
          </Button>

          {!isEdit ? <Typography>{dataset?.name ?? "No data"}</Typography> : <BaseInput {...register("name")} defaultValue={dataset?.name} />}
        </Box>

        <BasicTable data={datasetItems} fields={fields} />
      </Box>

      <Dialog open={openCfDialog} onClose={dialogHandlers.onCancel}>
        <Box p={4}>
          <Typography variant="h6">Xác nhận xóa?</Typography>
          <Box mb={2} />

          <Stack direction="row" spacing={1} justifyContent={"flex-end"} alignItems={"center"}>
            <Button onClick={dialogHandlers.onCancel} variant="outlined">
              Close
            </Button>
            <Button
              onClick={dialogHandlers.onConfirm}
              startIcon={isDeleting && <CircularProgress color="inherit" size={14} />}
              variant="contained"
              color="error"
            >
              Xóa
            </Button>
          </Stack>
        </Box>
      </Dialog>

      <NewPriceItem datasetId={datasetId} fetchDatasets={fetchDatasets} />
    </Box>
  );
};

type Props = {
  datasetId: number;
  fetchDatasets: () => void;
};
export const NewPriceItem: React.FC<Props> = ({ datasetId, fetchDatasets }) => {
  const { control, register, handleSubmit, reset } = useForm<IDatasetUpdateCreateItems>({ defaultValues: { dataset_items: [] } });
  const {
    fields: formArrayFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "dataset_items",
  });

  const tblFields: StrictField<IDatasetItemCreate>[] = [
    {
      header: "Order",
      fieldKey: "order",
    },
    {
      header: "Symbol",
      fieldKey: "symbol",
    },
    {
      header: "Ticker_price",
      fieldKey: "ticker_price",
    },
    {
      header: "Market_price",
      fieldKey: "market_price",
    },
  ];

  const onSaveNewItems = async (value: IDatasetUpdateCreateItems) => {
    try {
      const createdItems = value.dataset_items?.map((item) => {
        if ("id" in item) {
          const { id, ...rest } = item;
          return rest;
        } else return item;
      });

      const patchParams: IDatasetUpdateCreateItems = { id: datasetId };
      if (createdItems) patchParams.dataset_items = createdItems;

      const { id, ...otherParams } = patchParams;
      const response = await patchApi(`dataset/${datasetId}`, otherParams);

      if (response.success) {
        toast.success("Update success");
        fetchDatasets();
        reset();
      } else toast.error(response.error.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Box mt={6}>
      <Typography>Create new item</Typography>
      <Box component={"form"} onSubmit={handleSubmit(onSaveNewItems)}>
        <TableContainer>
          <TableHead>
            <TableRow>
              {tblFields.map((field) => (
                <TableCell
                  sx={{
                    padding: {
                      xs: "8px 8px 8px 12px",
                      sm: "16px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                    },
                  }}
                  width={field.width || DEFAULT_CELL_WIDTH}
                >
                  <StyledText sx={{ fontWeight: 700, color: "black" }}>{field.header}</StyledText>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {formArrayFields.map((field, index) => (
              <TableRow key={field.id}>
                {tblFields.map(({ fieldKey }: StrictField<IDatasetItemCreate>) => {
                  return (
                    <TableCell sx={{ padding: { xs: "12px", sm: "16px" }, whiteSpace: "nowrap" }}>
                      <BaseInput {...register(`dataset_items.${index}.${fieldKey}`)} />
                    </TableCell>
                  );
                })}
                <TableCell>
                  <IconButton onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>

        <Button type="button" onClick={() => append({ datasets_id: datasetId, order: 0, symbol: "" })} variant="outlined" sx={{ mt: 2 }}>
          Add New Row
        </Button>

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Items
        </Button>
      </Box>
    </Box>
  );
};

const StyledText = styled(Typography)(({ theme }) => ({
  textAlign: "left",
  color: "white",
  fontWeight: 500,
  fontSize: 15,
  [theme.breakpoints.up("sm")]: {
    fontSize: 17,
  },
}));
