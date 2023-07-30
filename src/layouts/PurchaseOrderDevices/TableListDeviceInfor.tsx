import { MRT_ColumnDef, type MRT_Row } from "material-react-table";
import { IDeviceInfor } from "../../types/IDeviceServiceInfo";
import MaterialReactTable from "material-react-table";
import moment from "moment";
import { Box, Button } from "@mui/material";
import { ExportToCsv } from "export-to-csv";

const renderRow = (key: keyof IDeviceInfor) => {
  return (row: IDeviceInfor) => row[key] ?? "trống";
};

interface IProps {
  dataSource: IDeviceInfor[];
  alowExportCsv?: boolean;
}

const TableListDeviceInfo = ({ dataSource, alowExportCsv }: IProps) => {
  const handleExportRows = (rows: MRT_Row<IDeviceInfor>[]) => {
    csvExporter.generateCsv(rows.map((row) => row._valuesCache));
  };

  return (
    <MaterialReactTable
      muiTableBodyProps={{
        sx: {
          backgroundColor: "#f5f5f5",
        },
      }}
      columns={columns}
      data={dataSource}
      initialState={{
        density: "compact",
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
        >
          {alowExportCsv && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                handleExportRows(table.getRowModel().rows);
              }}
            >
              Xuất
            </Button>
          )}
        </Box>
      )}
    />
  );
};

const columns: MRT_ColumnDef<IDeviceInfor>[] = [
  {
    accessorFn: renderRow("DeviceId"),
    header: "Mã thiết bị",
  },
  {
    accessorFn: renderRow("DeviceInfoId"),
    header: "Mã định danh thiết bị",
  },
  {
    accessorFn: renderRow("DeviceName"),
    header: "Tên thiết bị(vi)",
  },
  {
    accessorFn: renderRow("DeviceEnglishName"),
    header: "Tên thiết bị(En)",
  },
  {
    accessorFn: renderRow("Model"),
    header: "Số Model",
  },
  {
    accessorFn: renderRow("SerialNumber"),
    header: "Số Serial",
  },
  {
    accessorFn: renderRow("Specification"),
    header: "Thông số kỹ thuật",
  },
  {
    accessorFn: renderRow("Manufacturer"),
    header: "Hãng sản xuất",
  },
  {
    accessorFn: renderRow("Origin"),
    header: "Xuất xứ",
  },
  {
    accessorFn: renderRow("SupplierId"),
    header: "Mã nhà cung cấp",
  },
  {
    accessorFn: renderRow("SupplierName"),
    header: "Tên nhà cung cấp",
  },
  {
    accessorFn: renderRow("Unit"),
    header: "Đơn vị tính",
  },
  {
    accessorFn: renderRow("QuantityImport"),
    header: "Số lượng nhập",
  },
  {
    accessorFn: (row) =>
      moment.unix(Number(row.DateImport)).format("DD/MM/YYYY"),
    header: "Ngày Nhập",
  },
  {
    accessorFn: renderRow("YearStartUsage"),
    header: "Năm đưa vào sử dụng",
  },
  {
    accessorFn: (row) =>
      moment.unix(Number(row.StartGuarantee)).format("DD/MM/YYYY"),
    header: "Thời gian bắt đầu bảo hành",
  },

  {
    accessorFn: (row) =>
      moment.unix(Number(row.EndGuarantee)).format("DD/MM/YYYY"),
    header: "Thời gian kết thúc bảo hành",
  },
  {
    accessorFn: renderRow("PeriodicMaintenance"),
    header: "Chu kỳ bảo trì/ hiệu chuẩn định kỳ",
  },
  {
    accessorFn: renderRow("Status"),
    header: "Tình trạng",
  },
  {
    accessorFn: renderRow("DepartmentMaintenanceName"),
    header: "Đơn vị phụ trách hiệu chuẩn – bảo trì/sửa chữa",
  },
];

const csvOptions = {
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: false,
  headers: columns.map((c) => c.header),
};

const csvExporter = new ExportToCsv(csvOptions);

export default TableListDeviceInfo;
