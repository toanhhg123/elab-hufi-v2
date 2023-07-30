import { useEffect, useState } from "react";
import {
  IDeviceServiceInfo,
  initDeviceServiceInfo,
} from "../../types/IDeviceServiceInfo";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_Row,
} from "material-react-table";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  getAllAction,
  purchaseOrderDeviceSelect,
  savePurchaseOrderDeviceAction,
} from "./purchaseOrderDeviceSlice";
import { useAppDispatch } from "../../hooks";
import { Box } from "@mui/system";
import ErrorComponent from "../../components/ErrorToast";
import {
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormCmp from "./Form";
import SuccessToast from "../../components/Success";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AlertDialog from "../../components/AlertDialog";

const renderRow = (key: keyof IDeviceServiceInfo) => {
  return (row: IDeviceServiceInfo) => row[key] ?? "trống";
};

const PurchaseOrderDevices = () => {
  const { data, loading, error, successMessage } = useSelector(
    purchaseOrderDeviceSelect
  );
  const dispatch = useAppDispatch();

  const [isOpenModalForm, setOpenModalForm] = useState(false);

  const [dataForm, setDataForm] = useState<IDeviceServiceInfo>(
    initDeviceServiceInfo
  );
  const [typeForm, setTypeForm] = useState<"create" | "update">("create");

  const [showModalDelete, setShowModalDelete] = useState(false);

  const handleToggleForm = () => {
    setOpenModalForm(!isOpenModalForm);
  };

  const handleShowForm = (
    data: IDeviceServiceInfo,
    typeForm: "create" | "update"
  ) => {
    setDataForm(data);
    setTypeForm(typeForm);
    handleToggleForm();
  };

  const handleSubmitForm = (data: IDeviceServiceInfo) => {
    if (typeForm === "create") dispatch(savePurchaseOrderDeviceAction(data));
  };

  const handleShowModalDelete = (row: MRT_Row<IDeviceServiceInfo>) => {
    setDataForm(row.original);
    setShowModalDelete(true);
  };

  function handleDelete(): void {
    console.log(dataForm.OrderId);
  }

  useEffect(() => {
    dispatch(getAllAction());
  }, []);

  return (
    <Box>
      {error && <ErrorComponent errorMessage={error} />}
      {successMessage && (
        <SuccessToast
          isOpen={successMessage ? true : false}
          message={successMessage}
        />
      )}
      <AlertDialog
        message="Bạn có muốn xoá thực sự ??"
        handleOk={handleDelete}
        handleClose={() => setShowModalDelete(false)}
        isOpen={showModalDelete}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
        <Typography variant="h5">Quản lí phiếu nhập</Typography>
        <Button
          onClick={() => handleShowForm(initDeviceServiceInfo, "create")}
          variant="contained"
        >
          Tạo mới
        </Button>
      </Box>
      <Dialog
        fullScreen
        open={isOpenModalForm}
        onClose={handleToggleForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle textAlign="left">
          <b>Form Thông tin</b>
          <IconButton
            aria-label="close"
            onClick={handleToggleForm}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <FormCmp
          handleSubmit={handleSubmitForm}
          dataInit={dataForm}
          enableUpload={typeForm === "create"}
        />
      </Dialog>
      <MaterialReactTable
        enableRowActions
        enableStickyHeader
        columns={columns}
        data={data}
        state={{ isLoading: loading }}
        enableEditing={true}
        editingMode="modal"
        initialState={{
          density: "compact",
        }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <IconButton
              onClick={() => {
                handleShowForm(row.original, "update");
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                handleShowModalDelete(row);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      />
    </Box>
  );
};

export const columns: MRT_ColumnDef<IDeviceServiceInfo>[] = [
  {
    accessorFn: renderRow("OrderId"),
    header: "Mã phiếu nhập",
  },
  {
    accessorFn: renderRow("Content"),
    header: "Nội dung",
  },

  {
    accessorFn: (row) =>
      moment.unix(Number(row.DateCreate)).format("DD/MM/YYYY"),
    header: "Ngày Tạo",
  },
  {
    accessorFn: renderRow("DepartmentImportId"),
    header: "Phòng nhập (id)",
  },
  {
    accessorFn: renderRow("DepartmentImportName"),
    header: "Phòng nhập(name)",
  },
  {
    accessorFn: renderRow("EmployeeCreateId"),
    header: "Người Tạo(id)",
  },
  {
    accessorFn: renderRow("EmployeeCreateName"),
    header: "người tạo(name)",
  },
  {
    accessorFn: (row) => row.Title ?? "trống",
    header: "Tiêu đề",
  },
];

export default PurchaseOrderDevices;
