export interface IInstrumentHistory {
	DeviceId: String;
	InstrumentDeptId: String;
	DeviceName: String;
	Standard: String;
	Origin: String;
	Unit: String;
	listInstrumentTranfer: IInstrumentTranferItem[];
	listInstrumentResearch: IInstrumentResearchItem[];
	listLiquitedateInstrument: [];
}

export interface IInstrumentResearchItem {
	EmployeeId: String;
	EmployeeName: String;
	Quantity: Number;
	ExpResearchId: String;
}

export interface IInstrumentTranferItem {
	TransferId: Number;
	LabId: String;
	DateTransfer: String;
	QuantityTranfer: Number;
	LabIdReceive: String;
	EmployeeName: String;
}
