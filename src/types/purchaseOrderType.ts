import { IOrderChemicalType } from "./orderChemicalType"

export interface IPurchaseOrderType {
  OrderId: String,
  OrderDate: number,
  formatedOrderDate?: String,
  Content: String,
  Status: Boolean,
  SupplierId: Number,
  SupplierName?: String,
  EmployeeId: String,
  EmployeeName?: String,
}

export const dummyPurchaseOrderData: IPurchaseOrderType = {
  "OrderId": "",
  "OrderDate": -1,
  "Content": "",
  "Status": false,
  "SupplierId": -1,
  "EmployeeId": "",
}