import { MRT_ColumnDef } from "material-react-table";
import { IAccept } from "../../types/IDeviceServiceInfo";
import MaterialReactTable from "material-react-table";
import moment from "moment";

const renderRow = (key: keyof IAccept) => {
  return (row: IAccept) => row[key] ?? "trống";
};

interface IProps {
  dataSource: IAccept[];
}

const TableListAccept = ({ dataSource }: IProps) => {
  return (
    <MaterialReactTable
      muiTableBodyProps={{
        sx: {
          backgroundColor: "#f5f5f5",
        },
      }}
      displayColumnDefOptions={{
        "mrt-row-actions": {
          header: "Các hành động",
          muiTableHeadCellProps: {
            align: "center",
          },
          muiTableBodyCellProps: {
            align: "center",
          },
        },
        "mrt-row-numbers": {
          muiTableHeadCellProps: {
            align: "center",
          },
          muiTableBodyCellProps: {
            align: "center",
          },
        },
      }}
      initialState={{
        density: "compact",
      }}
      enableStickyHeader
      columns={columns}
      data={dataSource}
    />
  );
};

const columns: MRT_ColumnDef<IAccept>[] = [
  {
    accessorFn: renderRow("AcceptValue"),
    header: "Giá Trị",
    size: 100,
  },
  {
    accessorFn: (row) =>
      moment.unix(Number(row.AcceptDate)).format("DD/MM/YYYY"),
    header: "Thời Gian xác nhận",
    size: 100,
  },
  {
    accessorFn: renderRow("ContentAccept"),
    header: "Nội dung",
    size: 100,
  },
  {
    accessorFn: renderRow("EmployeeAcceptId"),
    header: "ID nhân viên",
    size: 100,
  },
  {
    accessorFn: renderRow("EmployeeAcceptName"),
    header: "Tên Nhân Viên",
    size: 100,
  },
];

export default TableListAccept;
