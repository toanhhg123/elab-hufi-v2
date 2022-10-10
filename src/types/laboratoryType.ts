export interface ILaboratoryType {
    LabId?: number,
    LabName: String,
    Location: String,
    Note: String
}

export const dummyLaboratoryData: ILaboratoryType = {
    "LabId": -1,
    "LabName": "",
    "Location": "",
    "Note": ""
}