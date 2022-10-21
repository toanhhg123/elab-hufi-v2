export interface IOrderChemicalType {
  OrderId: String,
  ChemicalId: String,
  ChemicalName?: String,
  Specifications?: String,
  Origin?: String,
  Unit?: String,
  Amount: Number,
  Price: Number,
  ManufacturerId?: Number,
  ManufacturerName?: String,
}

export const dummyOrderChemicalData = {
  "OrderId": "",
  "ChemicalId": "",
  "Amount": 0,
  "Price": -1,
}