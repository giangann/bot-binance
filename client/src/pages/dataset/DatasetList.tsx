import DeleteIcon from "@mui/icons-material/Delete";
import MediationIcon from "@mui/icons-material/Mediation";
import { Box, Button, CircularProgress, Dialog, IconButton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BackToHomePage } from "../../components/BackHome/BackToHomePage";
import { BasicTable } from "../../components/Table/BasicTable";
import { StrictField } from "../../components/Table/Customtable";
import { deleteApi, getApi } from "../../request/request";
import { IDatasetEntity } from "../../shared/types/dataset";
import { DatasetCreate } from "./DatasetCreate";
export const DatasetList = () => {
  const [datasets, setDatasets] = useState<IDatasetEntity[]>([]);
  const [openCfDialog, setOpenCfDialg] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [dialogHandlers, setDialogHandlers] = useState<{ onConfirm: () => void; onCancel: () => void }>({
    onConfirm: () => {},
    onCancel: () => {},
  });
  const navigate = useNavigate();
  const fetchDatasets = useCallback(async () => {
    const response = await getApi<IDatasetEntity[]>("dataset");
    if (response.success) setDatasets(response.data);
    else toast.error(response.error.message);
  }, []);
  const onDeleteItem = async (itemId: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setOpenCfDialg(true);

      const handleConfirmDelete = async () => {
        try {
          setIsDeleting(true);

          const response = await deleteApi(`dataset/${itemId}`);
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
  }, []);
  return (
    <Box>
      <BackToHomePage />
      <Typography>Dataset List</Typography>

      <BasicTable data={datasets} fields={fields} />
      <DatasetCreate fetchDatasets={fetchDatasets} />

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
    </Box>
  );
};
