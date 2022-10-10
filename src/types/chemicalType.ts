export interface IChemicalType {
    ChemicalId?: String,
    ChemicalName: String,
    Specifications: String,
    Origin: String,
    Unit: String,
    Quantity: Number,
    ManufacturerId: Number
}

export const dummyChemicalData: IChemicalType = { 
    "ChemicalId": "", 
    "ChemicalName": "", 
    "Specifications": "", 
    "Origin": "", 
    "Unit": "", 
    "Quantity": 0, 
    "ManufacturerId": -1
}