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
  Status: string;
  Title: string | null;
  listAccept: IAccept[] | undefined | null;
  listDeviceInfo: IDeviceInfor[] | undefined | null;
}
