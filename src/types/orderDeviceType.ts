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
  ManufacturerName?: String
}

export const dummyOrderDeviceData = {
  "DeviceName": "",
  "Unit": "",
  "DeviceDetailId": "",
  "QuantityOriginal": -1,
  "Price": -1,
  "Model": "",
  "Origin": "",
  "ManufacturerId": -1,
  "DeviceId": ""
}