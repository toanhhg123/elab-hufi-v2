import moment from "moment";

export interface IAccept {
  AcceptDate: string;
  AcceptValue: string;
  ContentAccept: null;
  EmployeeAcceptId: string;
  EmployeeAcceptName: string;
}

export interface IDeviceInfor {
  DateImport: string;
  DepartmentImportId: string;
  DepartmentImportName: string;
  DepartmentMaintenanceId: string;
  DepartmentMaintenanceName: string;
  DeviceEnglishName: null | string;
  DeviceId: string;
  DeviceInfoId: string;
  DeviceName: null | string;
  EndGuarantee: string;
  Manufacturer: string;
  Model: string;
  Origin: string;
  PeriodicMaintenance: number;
  QuantityImport: number;
  SerialNumber: string;
  Specification: string;
  StartGuarantee: string;
  Status: string;
  SupplierId: number;
  SupplierName: string;
  Unit: string;
  YearStartUsage: number;
}

export interface IDeviceServiceInfo {
  Content: string | null;
  DateCreate: string;
  DepartmentImportId: string;
  DepartmentImportName: string;
  EmployeeCreateId: string;
  EmployeeCreateName: string;
  Lock: "True" | string;
  OrderId: string;
  Status: string | null;
  Title: string | null;
  listAccept: IAccept[] | undefined | null;
  listDeviceInfo: IDeviceInfor[] | undefined | null;
}

export const initAccept: IAccept = {
  AcceptDate: moment().unix().toString(),
  AcceptValue: "",
  ContentAccept: null,
  EmployeeAcceptId: "",
  EmployeeAcceptName: "",
};

export const initDeviceInfo: IDeviceInfor = {
  DateImport: moment().unix().toString(),
  DepartmentImportId: "",
  DepartmentImportName: "",
  DepartmentMaintenanceId: "",
  DepartmentMaintenanceName: "",
  DeviceEnglishName: null,
  DeviceId: "",
  DeviceInfoId: "",
  DeviceName: null,
  EndGuarantee: moment().unix().toString(),
  Manufacturer: "",
  Model: "",
  Origin: "",
  PeriodicMaintenance: 0,
  QuantityImport: 0,
  SerialNumber: "",
  Specification: "",
  StartGuarantee: moment().unix().toString(),
  Status: "",
  SupplierId: 0,
  SupplierName: "",
  Unit: "",
  YearStartUsage: 0,
};

export const initDeviceServiceInfo: IDeviceServiceInfo = {
  Content: null,
  DateCreate: moment().unix().toString(),
  DepartmentImportId: "",
  DepartmentImportName: "",
  EmployeeCreateId: "",
  EmployeeCreateName: "",
  Lock: "",
  OrderId: "",
  Status: null,
  Title: null,
  listAccept: [],
  listDeviceInfo: [],
};

export interface IFormDeviceServiceInfo {
  sourceKey: keyof IDeviceServiceInfo;
  label: string;
  type: "string" | "Date";
}

export const formsControlDeviceServiceInfo: IFormDeviceServiceInfo[] = [
  {
    sourceKey: "Content",
    label: "Nội dung",
    type: "string",
  },
  {
    sourceKey: "DateCreate",
    label: "Ngày Tạo",
    type: "Date",
  },
  {
    sourceKey: "DepartmentImportId",
    label: "Phòng nhập(id)",
    type: "string",
  },
  {
    sourceKey: "DepartmentImportName",
    label: "Phòng nhập(name)",
    type: "string",
  },
  {
    sourceKey: "EmployeeCreateId",
    label: "Nhân viên(id)",
    type: "string",
  },
  {
    sourceKey: "EmployeeCreateName",
    label: "Nhân Viên (name)",
    type: "string",
  },
  {
    sourceKey: "OrderId",
    label: "orderId",
    type: "string",
  },
  {
    sourceKey: "Title",
    label: "Tiêu đề",
    type: "string",
  },
];
