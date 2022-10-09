export interface IDeviceSpecType {
    DeviceId?: String,
    SpecsID: Number,
    SpecsName: String,
    SpecsValue: String
}

export const dummyDeviceSpecData: IDeviceSpecType = { 
    "DeviceId": "", 
    "SpecsID": -1, 
    "SpecsName": "", 
    "SpecsValue": "" 
}
