export interface IExportChemicalType {
	ChemicalName: String;
	ExpChemDeptId: String;
	ExportLabId?: String;
	AmountOriginal?: Number;
	ExpRegGeneralId?: String;
	Unit: String;
	ChemDetailId?: String;
	ExportId?: String;
	ExpSubjectId?: String;
	Amount?: Number;
}

export const dummyExportChemicalData: IExportChemicalType = {
	ChemicalName: '',
	Unit: '',
	ExpChemDeptId: '',
	AmountOriginal: 0,
	ChemDetailId: '',
	ExportId: '',
	ExpSubjectId: '',
	Amount: 0,
	ExpRegGeneralId: '',
	ExportLabId: '',
};
