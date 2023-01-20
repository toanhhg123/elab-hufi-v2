export interface IExportInstrumentResearch {
	ExpResearchId: String;
	ExportDate: String;
	Content: String;
	EmployeeIdCreate: String;
	EmployeeNameCreate: String;
	InstructorId: String;
	InstructorName: String;
	DepartmentId: Number;
	DepartmentName: String;
	RegisterGeneralId: Number;
	listInstrument: IExportInstrumentResearchItem[];
}

export interface IExportInstrumentResearchItem {
	InstrumentDeptId: String;
	DeviceName: String;
	DeviceId: String;
	Unit: String;
	Quantity: Number;
}

export const dummyExportInstrumentResearch: IExportInstrumentResearch = {
	ExpResearchId: '',
	ExportDate: `${(Date.now() / 1000) | 0}`,
	Content: '',
	EmployeeIdCreate: '',
	EmployeeNameCreate: '',
	InstructorId: '',
	InstructorName: '',
	DepartmentId: 0,
	DepartmentName: '',
	RegisterGeneralId: 0,
	listInstrument: [],
};
