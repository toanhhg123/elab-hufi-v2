import { MRT_ColumnDef } from "material-react-table";
import { IDeviceType } from "../../types/deviceType";


export const normalColumns: MRT_ColumnDef<IDeviceType>[] = [
  {
    accessorKey: 'DeviceId',
    header: 'Id thiết bị',
    size: 100,
  },
  {
    accessorKey: 'DeviceName',
    header: 'Tên thiết bị',
    size: 100,
  },
  {
    accessorKey: 'DeviceType',
    header: 'Loại thiết bị',
    size: 100,
  },
  {
    accessorKey: 'Model',
    header: 'Mẫu',
    size: 100,
  },
  {
    accessorKey: 'Origin',
    header: 'Xuất xứ',
    size: 100,
  },
  {
    accessorKey: 'Unit',
    header: 'Đơn vị',
    size: 100,
  },
  {
    accessorKey: 'Standard',
    header: 'Tiêu chuẩn',
    size: 100,
  },
  {
    accessorKey: 'Quantity',
    header: 'Số lượng',
    size: 100,
  },
  // {
  //   accessorKey: 'HasTrain',
  //   header: 'Đã tập huấn',
  //   size: 100,
  // },
  {
    accessorKey: 'ManufacturerName',
    header: 'Nhà sản xuất',
    size: 100,
  },
];

export const generalOrderColumns: MRT_ColumnDef<IDeviceType>[] = [
  {
    accessorKey: 'OrderId',
    header: 'Id phiếu nhập',
    size: 100,
  },
  {
    accessorKey: 'DeviceId',
    header: 'Id thiết bị',
    size: 100,
  },
  {
    accessorKey: 'DeviceName',
    header: 'Tên thiết bị',
    size: 100,
  },
  {
    accessorKey: 'DeviceType',
    header: 'Loại thiết bị',
    size: 100,
  },
  {
    accessorKey: 'Model',
    header: 'Mẫu',
    size: 100,
  },
  {
    accessorKey: 'Origin',
    header: 'Xuất xứ',
    size: 100,
  },
  {
    accessorKey: 'Unit',
    header: 'Đơn vị',
    size: 100,
  },
  {
    accessorKey: 'Standard',
    header: 'Tiêu chuẩn',
    size: 100,
  },
  {
    accessorKey: 'Quantity',
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
];

export const detailOrderColumns: MRT_ColumnDef<IDeviceType>[] = [
  {
    accessorKey: 'DeviceId',
    header: 'Mã thiết bị',
    size: 100,
  },
  {
    accessorKey: 'DeviceName',
    header: 'Tên thiết bị',
    size: 100,
  },
  {
    accessorKey: 'DeviceType',
    header: 'Loại thiết bị',
    size: 100,
  },
  {
    accessorKey: 'Model',
    header: 'Mẫu',
    size: 100,
  },
  {
    accessorKey: 'Origin',
    header: 'Xuất xứ',
    size: 100,
  },
  {
    accessorKey: 'Unit',
    header: 'Đơn vị',
    size: 100,
  },
  {
    accessorKey: 'Standard',
    header: 'Tiêu chuẩn',
    size: 100,
  },
  {
    accessorKey: 'Quantity',
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
];