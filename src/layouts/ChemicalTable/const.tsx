import { MRT_ColumnDef } from "material-react-table";
import { IChemicalType } from "../../types/chemicalType";


export const normalColumns: MRT_ColumnDef<IChemicalType>[] = [
  {
    accessorKey: 'ChemicalId',
    header: 'Id hoá chất',
    size: 100,
  },
  {
    accessorKey: 'ChemicalName',
    header: 'Tên hoá chất',
    size: 100,
  },
  {
    accessorKey: 'Specifications',
    header: 'Thông số',
    size: 100,
  },
  {
    accessorKey: 'Origin',
    header: 'Nguồn gốc',
    size: 100,
  },
  {
    accessorKey: 'Unit',
    header: 'Đơn vị',
    size: 100,
  },
  {
    accessorKey: 'Amount',
    header: 'Số lượng',
    size: 100,
  },
  {
    accessorKey: 'ManufacturerName',
    header: 'Nhà sản xuất',
    size: 100,
  },
];

export const generalOrderColumns: MRT_ColumnDef<IChemicalType>[] = [
  {
    accessorKey: 'OrderId',
    header: 'Id phiếu nhập',
    size: 100,
  },
  {
    accessorKey: 'ChemicalId',
    header: 'Id hoá chất',
    size: 100,
  },
  {
    accessorKey: 'ChemicalName',
    header: 'Tên hoá chất',
    size: 100,
  },
  {
    accessorKey: 'Specifications',
    header: 'Thông số',
    size: 100,
  },
  {
    accessorKey: 'Origin',
    header: 'Nguồn gốc',
    size: 100,
  },
  {
    accessorKey: 'Unit',
    header: 'Đơn vị',
    size: 100,
  },
  {
    accessorKey: 'Amount',
    header: 'Số lượng',
    size: 100,
  },
  {
    accessorKey: 'ManufacturerName',
    header: 'Nhà sản xuất',
    size: 100,
  },
  {
    accessorKey: 'Price',
    header: 'Giá',
    size: 100,
  },
]

export const detailOrderColumns: MRT_ColumnDef<IChemicalType>[] = [
  {
    accessorKey: 'ChemicalId',
    header: 'Id hoá chất',
    size: 100,
  },
  {
    accessorKey: 'ChemicalName',
    header: 'Tên hoá chất',
    size: 100,
  },
  {
    accessorKey: 'Specifications',
    header: 'Thông số',
    size: 100,
  },
  {
    accessorKey: 'Origin',
    header: 'Nguồn gốc',
    size: 100,
  },
  {
    accessorKey: 'Unit',
    header: 'Đơn vị',
    size: 100,
  },
  {
    accessorKey: 'Amount',
    header: 'Số lượng',
    size: 100,
  },
  {
    accessorKey: 'ManufacturerName',
    header: 'Nhà sản xuất',
    size: 100,
  },
  {
    accessorKey: 'Price',
    header: 'Giá',
    size: 100,
  },
]