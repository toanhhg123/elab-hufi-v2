import { useEffect } from "react";
import { IDeviceServiceInfo } from "../../types/IDeviceServiceInfo";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import moment from "moment";
import DetailPannel from "./DetailPanel";
import { useSelector } from "react-redux";
import {
  getAllAction,
  purchaseOrderDeviceSelect,
} from "./purchaseOrderDeviceSlice";
import { useAppDispatch } from "../../hooks";
import { Box } from "@mui/system";
import ErrorComponent from "../../components/ErrorToast";

const renderRow = (key: keyof IDeviceServiceInfo) => {
  return (row: IDeviceServiceInfo) => row[key] ?? "trống";
};

const PurchaseOrderDevices = () => {
  const { data, loading, error } = useSelector(purchaseOrderDeviceSelect);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllAction());
  }, []);

  return (
    <Box>
      {error && <ErrorComponent errorMessage={error} />}
      <MaterialReactTable
        enableRowActions
        columns={columns}
        data={data}
        renderDetailPanel={DetailPannel}
        state={{ isLoading: loading }}
      />
    </Box>
  );
};

const columns: MRT_ColumnDef<IDeviceServiceInfo>[] = [
  {
    accessorFn: renderRow("Content"),
    header: "Nội dung",
    size: 150,
  },
  {
    accessorFn: (row) =>
      moment.unix(Number(row.DateCreate)).format("DD/MM/YYYY"),
    header: "Ngày Tạo",
    size: 150,
  },
  {
    accessorFn: renderRow("DepartmentImportId"),
    header: "Phòng nhập (id)",
    size: 150,
  },
  {
    accessorFn: renderRow("DepartmentImportName"),
    header: "Phòng nhập(name)",
    size: 150,
  },
  {
    accessorFn: renderRow("EmployeeCreateId"),
    header: "Người Tạo(id)",
    size: 150,
  },
  {
    accessorFn: renderRow("EmployeeCreateName"),
    header: "người tạo(name)",
    size: 150,
  },
  {
    accessorFn: renderRow("OrderId"),
    header: "OrderId",
    size: 150,
  },
  {
    accessorFn: (row) => row.Title ?? "trống",
    header: "Tiêu đề",
    size: 150,
  },
];

export default PurchaseOrderDevices;
