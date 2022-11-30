export interface IChemDeptType {
	AmountExport: Number,
	AmountRemain: Number,
	DepartmentId: Number,
	DepartmentName: String,
	ChemDeptId: String,
	AmountOriginal: Number,
	Unit: String,
	ChemDetailId: String
}

export interface IChemicalDetailType {
	AmountExport: Number,
	AmountRemain: Number,
	OrderDate: String,
	formatedOrderDate?: String,
	OrderId: String,
	ChemDetailId: String,
	AmountOriginal: 450,
	ManufacturingDate: String,
	ExpiryDate: String,
	formatedExpiryDate: String,
	LotNumber: String,
	Price: Number,
	ChemicalId: String,
	ManufacturerId: 1,
	ManufacturerName: String,
	listChemDept: IChemDeptType[],
}

export interface IExportChemicalType {
	SubjectId: String,
	SubjectName: String,
	Semester: Number,
	Schoolyear: String,
	EmployeeInCharge: String,
	EmployeeCreate: String,
	ExpSubjectId: String,
	ChemDeptId: String,
	Amount: Number
}

export interface IExportChemRegType {
	RegisterGeneralId: Number,
	Instructor: String,
	ThesisName: String,
	Semester: Number,
	Schoolyear: String,
	ChemDeptId: String,
	Amount: Number
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
	DepartmentId?: Number,
	DepartmentName?: String,
	ChemDeptId?: String,
	ChemDetailId?: String,
	listExportChemical?: IExportChemicalType[],
	listExportChemReg?: IExportChemRegType[]
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