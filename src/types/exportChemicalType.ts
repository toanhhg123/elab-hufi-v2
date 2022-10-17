export interface IExportChemicalType {
    "ExportId": String,
    "ChemicalId": String,
    "Amount": Number,
    "Origin"?: String,
    "ChemicalName"?: String,
    "ManufacturerName"?: String,
}

export const dummyExportChemicalData: IExportChemicalType = {
    "ExportId": "",
    "ChemicalId": "",
    "Amount": -1,
    "Origin": "",
    "ChemicalName": "",
    "ManufacturerName": "",
}