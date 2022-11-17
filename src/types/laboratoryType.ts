export interface IListDeviceBelongingToLaboratoryType {
    ExpDeviceDeptId: string,
    SerialNumber: string,
    DeviceName: string,
    Unit: string,
    ExportDate: number
}

export interface IListInstrumentBeloingToLaboratoryType {
    ExportDate: string,
    DeviceName: string,
    Unit: string,
    ExpDeviceDeptId: string,
    Quantity: number
}

export interface ILaboratoryType {
    LabId?: number,
    LabName: String,
    Location: String,
    Note: String,
    listDevice: IListDeviceBelongingToLaboratoryType[] | []
    listInstrument: IListInstrumentBeloingToLaboratoryType[] | []
}

export const dummyLaboratoryData: ILaboratoryType = {
    "LabId": -1,
    "LabName": "",
    "Location": "",
    "Note": "",
    listDevice: [],
    listInstrument: []
}