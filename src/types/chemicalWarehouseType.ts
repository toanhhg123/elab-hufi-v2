export interface IChemDeptType {
	AmountExport: Number;
	AmountRemain: Number;
	DepartmentId: Number;
	DepartmentName: String;
	ChemDeptId: String;
	AmountOriginal: Number;
	Unit: String;
	ChemDetailId: String;
}

export interface IChemicalDetailType {
	AmountExport: Number;
	AmountRemain: Number;
	AmountLiquidate: Number;
	OrderDate: String;
	formatedOrderDate?: String;
	OrderId: String;
	ChemDetailId: String;
	AmountOriginal: 450;
	ManufacturingDate: String;
	ExpiryDate: String;
	formatedExpiryDate: String;
	LotNumber: String;
	Price: Number;
	ChemicalId: String;
	ManufacturerId: 1;
	ManufacturerName: String;
	listChemDept: IChemDeptType[];
	WarningExpiry: String;
}

export interface IExportChemicalType {
	SubjectId: String;
	SubjectName: String;
	Semester: Number;
	Schoolyear: String;
	EmployeeInCharge: String;
	EmployeeCreate: String;
	ExpSubjectId: String;
	ChemDeptId: String;
	Amount: Number;
}

export interface IExportChemRegType {
	RegisterGeneralId: Number;
	Instructor: String;
	ThesisName: String;
	Semester: Number;
	Schoolyear: String;
	ChemDeptId: String;
	Amount: Number;
}

export interface IChemicalWarehouseType {
	AmountOriginal: Number;
	AmountExport: Number;
	AmountRemain: Number;
	AmountLiquidate: Number;
	CASnumber: String;
	FormatedAllowRegister?: string;
	AllowRegister: boolean;
	listChemicalDetail: IChemicalDetailType[];
	ChemicalId: String;
	ChemicalName: String;
	Specifications: String;
	Origin: String;
	Unit: String;
	WarningExpiry?: String;
	ImportDate?: String;
	ExpiryDate?: String;
	DepartmentId?: Number;
	DepartmentName?: String;
	ChemDeptId?: String;
	ChemDetailId?: String;
	listExportChemical?: IExportChemicalType[];
	listExportChemReg?: IExportChemRegType[];
}

export interface ILiquidateChemical {
	listChemical: ILiquidateChemicalItem[];
	ExpLiquidateDeptId: String;
	ExportDate: String;
	Content: String;
	Note: String;
	EmployeeId: String;
	EmployeeName: String;
	DepartmentId: Number;
	DepartmentName: String;
	Accept: String | null;
	UserAccept: String | null;
}

export interface ILiquidateChemicalItem {
	ChemDeptId: String;
	ChemicalId: String;
	ChemicalName: String;
	Unit: String;
	Amount: Number;
}

export const dummyLiquidateChemical: ILiquidateChemical = {
	listChemical: [],
	ExpLiquidateDeptId: '',
	ExportDate: `${(Date.now() / 1000) | 0}`,
	Content: '',
	Note: '',
	EmployeeId: '',
	EmployeeName: '',
	DepartmentId: 0,
	DepartmentName: '',
	Accept: '',
	UserAccept: '',
};

export const dummyChemicalWarehouseData: IChemicalWarehouseType = {
	AmountOriginal: 0,
	AmountExport: 0,
	AmountRemain: 0,
	AmountLiquidate: 0,
	CASnumber: '',
	listChemicalDetail: [],
	ChemicalId: '',
	ChemicalName: '',
	Specifications: '',
	Origin: '',
	Unit: '',
	AllowRegister: false,
};
