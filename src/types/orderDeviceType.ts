export interface IOrderDeviceType {
  OrderId: String,
  DeviceId: String,
  DeviceName?: String,
  DeviceType?: String,
  Model?: String,
  Origin?: String,
  Unit?: String,
  Standard?: String,
  Quantity: Number,
  HasTrain?: Number,
  ManufacturerId?: Number,
  ManufacturerName?: String
  Price: Number,
}

export const dummyOrderDeviceData = {
  "OrderId": "",
  "DeviceId": "",
  "Quantity": 0,
  "Price": -1,
}