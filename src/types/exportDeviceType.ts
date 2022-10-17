export interface IExportDeviceType {
    ExportId: String,
    DeviceId: String,
    Quantity: number,
    DeviceName?: String,
    Origin?: String,
    Model?: String,
}

export const dummyExportDevice: IExportDeviceType = {
    ExportId: "",
    DeviceId: "",
    Quantity: 0,
    DeviceName: "",
    Origin: "",
    Model: "",
}