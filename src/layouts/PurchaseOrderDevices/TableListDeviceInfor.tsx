import { MRT_ColumnDef, type MRT_Row } from "material-react-table";
import { IDeviceInfor, initDeviceInfo } from "../../types/IDeviceServiceInfo";
import MaterialReactTable from "material-react-table";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, MenuItem } from "@mui/material";
import { ExportToCsv } from "export-to-csv";
import { useEffect, useState } from "react";
import { ModalFormDeviceInfo } from "./ModalFormDeviceInfo";

interface IProps {
  dataSource: IDeviceInfor[];
  alowExportCsv?: boolean;
  onTableChange: (data: IDeviceInfor[]) => void;
}

const TableListDeviceInfo = ({
  dataSource,
  alowExportCsv,
  onTableChange,
}: IProps) => {
  const [data, setData] = useState(dataSource);
  const [formState, setStateForm] = useState<{
    typeForm: "create" | "update";
    dataForm: IDeviceInfor;
    showForm: boolean;
  }>({
    typeForm: "create",
    dataForm: initDeviceInfo,
    showForm: false,
  });

  const { typeForm, showForm, dataForm } = formState;

  const handleSubmit = (value: IDeviceInfor) => {
    let newState: IDeviceInfor[] = [];

    if (typeForm === "update") {
      newState = [
        ...data.map((x) => (x.DeviceInfoId === value.DeviceInfoId ? value : x)),
      ];
    }
    onTableChange(newState);
  };

  const handleExportRows = (rows: MRT_Row<IDeviceInfor>[]) => {
    csvExporter.generateCsv(rows.map((row) => row._valuesCache));
  };

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  return (
    <>
      <ModalFormDeviceInfo
        columns={columns}
        open={showForm}
        onClose={() => setStateForm({ ...formState, showForm: false })}
        dataForm={dataForm}
        onSubmit={handleSubmit}
      />
      <MaterialReactTable
        muiTableBodyProps={{
          sx: {
            backgroundColor: "#f5f5f5",
          },
        }}
        columns={columns}
        data={data}
        initialState={{
          density: "compact",
        }}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <MenuItem
            key="edit"
            onClick={() =>
              setStateForm({
                typeForm: "update",
                showForm: true,
                dataForm: row.original,
              })
            }
          >
            Edit
          </MenuItem>,
          <MenuItem key="delete" onClick={() => console.info("Delete")}>
            Delete
          </MenuItem>,
        ]}
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

            <Button color="primary" variant="contained">
              <AddIcon />
            </Button>
          </Box>
        )}
      />
    </>
  );
};

const renderRow = (key: keyof IDeviceInfor) => {
  return (row: IDeviceInfor) => row[key] ?? "trống";
};

const columns: MRT_ColumnDef<IDeviceInfor>[] = [
  {
    accessorFn: renderRow("DeviceId"),
    accessorKey: "DeviceId",
    header: "Mã thiết bị",
  },
  {
    accessorFn: renderRow("DeviceInfoId"),
    accessorKey: "DeviceInfoId",
    header: "Mã định danh thiết bị",
  },
  {
    accessorFn: renderRow("DeviceName"),
    accessorKey: "DeviceName",
    header: "Tên thiết bị(vi)",
  },
  {
    accessorFn: renderRow("DeviceEnglishName"),
    accessorKey: "DeviceEnglishName",
    header: "Tên thiết bị(En)",
  },
  {
    accessorFn: renderRow("Model"),
    accessorKey: "Model",
    header: "Số Model",
  },
  {
    accessorFn: renderRow("SerialNumber"),
    accessorKey: "SerialNumber",
    header: "Số Serial",
  },
  {
    accessorFn: renderRow("Specification"),
    accessorKey: "Specification",
    header: "Thông số kỹ thuật",
  },
  {
    accessorFn: renderRow("Manufacturer"),
    accessorKey: "Manufacturer",
    header: "Hãng sản xuất",
  },
  {
    accessorFn: renderRow("Origin"),
    accessorKey: "Origin",
    header: "Xuất xứ",
  },
  {
    accessorFn: renderRow("SupplierId"),
    accessorKey: "SupplierId",
    header: "Mã nhà cung cấp",
  },
  {
    accessorFn: renderRow("SupplierName"),
    accessorKey: "SupplierName",
    header: "Tên nhà cung cấp",
  },
  {
    accessorFn: renderRow("Unit"),
    accessorKey: "Unit",
    header: "Đơn vị tính",
  },
  {
    accessorFn: renderRow("QuantityImport"),
    accessorKey: "QuantityImport",
    header: "Số lượng nhập",
  },
  {
    accessorFn: (row) =>
      moment.unix(Number(row.DateImport)).format("DD/MM/YYYY"),
    accessorKey: "DateImport",
    header: "Ngày Nhập",
  },
  {
    accessorFn: renderRow("YearStartUsage"),
    accessorKey: "YearStartUsage",
    header: "Năm đưa vào sử dụng",
  },
  {
    accessorFn: (row) =>
      moment.unix(Number(row.StartGuarantee)).format("DD/MM/YYYY"),
    accessorKey: "StartGuarantee",
    header: "Thời gian bắt đầu bảo hành",
  },

  {
    accessorFn: (row) =>
      moment.unix(Number(row.EndGuarantee)).format("DD/MM/YYYY"),
    header: "Thời gian kết thúc bảo hành",
  },
  {
    accessorFn: renderRow("PeriodicMaintenance"),
    accessorKey: "PeriodicMaintenance",
    header: "Chu kỳ bảo trì/ hiệu chuẩn định kỳ",
  },
  {
    accessorFn: renderRow("Status"),
    accessorKey: "Status",
    header: "Tình trạng",
  },
  {
    accessorFn: renderRow("DepartmentMaintenanceName"),
    accessorKey: "DepartmentMaintenanceName",
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
