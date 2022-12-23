export interface IListDeviceBelongingToLaboratoryType {
    DeviceName: string,
    Unit: string,
    DateStartUsage: string,
    DeviceDeptId: string,
    EndGuarantee: string,
    HoursUsageTotal: number,
    ManufacturingDate: string,
    PeriodicMaintenance: number,
    SerialNumber: string,
    StartGuarantee: string,
    Status: string,
}

export interface IListInstrumentBelongingToLaboratoryType {
    DeviceName: string,
    Unit: string,
    DeviceDeptId: string,
    Quantity: number
}

export interface ILaboratoryType {
    LabId?: String,
    LabName: String,
    Location: String,
    Note: String,
    listDevice: IListDeviceBelongingToLaboratoryType[] | []
    listInstrument: IListInstrumentBelongingToLaboratoryType[] | []
}

export const dummyLaboratoryData: ILaboratoryType = {
    "LabId": "",
    "LabName": "",
    "Location": "",
    "Note": "",
    listDevice: [],
    listInstrument: []
}