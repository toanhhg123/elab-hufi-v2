export interface IOrderChemicalType {
  ChemicalName: String,
  ChemDetailId: String,
  AmountOriginal: Number,
  ManufacturingDate: number,
  formatedManufacturingDate?: String,
  ExpiryDate: number,
  formatedExpiryDate?: String,
  LotNumber: String,
  Unit: String,
  Price: Number,
  ChemicalId: String,
  ManufacturerId: Number,
  ManufacturerName: String,
}

export interface IOrderDeviceType {
  DeviceName: String,
  Unit: String,
  DeviceDetailId: String,
  QuantityOriginal: Number,
  Price: Number,
  Model: String,
  Origin: String,
  ManufacturerId: Number,
  DeviceId: String
  ManufacturerName: String
}

export interface IPurchaseOrderType {
  OrderId: String,
  OrderDate: number,
  formatedOrderDate?: String,
  Content: String,
  Note: String,
  SupplierId: Number,
  SupplierName: String,
  EmployeeId: String,
  EmployeeName: String,
  DepartmentId: Number,
  DepartmentName: String,
  listChemDetail: IOrderChemicalType[],
  listDevDetail: IOrderDeviceType[]
}

export const dummyPurchaseOrderData: IPurchaseOrderType = {
  "OrderId": "",
  "OrderDate": -1,
  "Content": "",
  "Note": "",
  "SupplierId": -1,
  "SupplierName": "",
  "EmployeeId": "",
  "EmployeeName": "",
  "DepartmentId": -1,
  "DepartmentName": "",
  "listChemDetail": [],
  "listDevDetail": []
}