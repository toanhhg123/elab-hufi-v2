import { IOrderChemicalType } from "./orderChemicalType"
import { IOrderDeviceType } from "./orderDeviceType"

export interface IPurchaseOrderType {
  OrderId: String,
  OrderDate: number,
  formatedOrderDate?: String,
  Content: String,
  Note: String,
  SupplierId: Number,
  SupplierName?: String,
  EmployeeId: String,
  EmployeeName?: String,
  DepartmentId: Number,
  DepartmentName?: String,
  listChemDetail: IOrderChemicalType[],
  listDevDetail: IOrderDeviceType[]
}

export const dummyPurchaseOrderData: IPurchaseOrderType = {
  "OrderId": "",
  "OrderDate": -1,
  "Content": "",
  "Note": "",
  "SupplierId": -1,
  "EmployeeId": "",
  "DepartmentId": -1,
  "listChemDetail": [],
  "listDevDetail": []
}