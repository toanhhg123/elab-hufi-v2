interface IChemDept {
	AmountExport: Number,
	AmountRemain: Number,
	ExpChemDeptId: String,
	AmountOriginal: Number,
	Unit: String,
	ChemDetailId: String
}

export interface IChemicalDetailType {
	AmountExport: Number,
	AmountRemain: Number,
	OrderDate: String,
	formatedOrderDate?: String,
	ManufacturerName: String,
	listChemDept: IChemDept[],
	OrderId: String,
	ChemDetailId: String,
	AmountOriginal: Number,
	ManufacturingDate: String,
	ExpiryDate: String,
	formatedExpiryDate: String,
	LotNumber: String,
	Price: Number,
	ChemicalId: String,
	ManufacturerId: Number
}

export interface IChemicalWarehouseType {
	AmountOriginal: Number,
	AmountExport: Number,
	AmountRemain: Number,
	listChemicalDetail: IChemicalDetailType[],
	ChemicalId: String,
	ChemicalName: String,
	Specifications: String,
	Origin: String,
	Unit: String,
}

export const dummyChemicalWarehouseData: IChemicalWarehouseType = {
	"AmountOriginal": -1,
	"AmountExport": -1,
	"AmountRemain": -1,
	"listChemicalDetail": [],
	"ChemicalId": "",
	"ChemicalName": "",
	"Specifications": "",
	"Origin": "",
	"Unit": "",
}