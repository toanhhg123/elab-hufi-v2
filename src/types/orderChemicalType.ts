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
  ManufacturerName?: String,
}

export const dummyOrderChemicalData = {
  "ChemicalName": "",
  "ChemDetailId": "",
  "AmountOriginal": -1,
  "ManufacturingDate": -1,
  "ExpiryDate": -1,
  "LotNumber": "",
  "Unit": "",
  "Price": -1,
  "ChemicalId": "",
  "ManufacturerId": -1,
}