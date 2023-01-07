export interface IDeviceTransfer {
	listDeviceInfo?: IDeviceSerial[];
	listInstrument?: IDeviceSerial[];
	LabId: String;
	LabName: String;
	Location: String;
}

export interface IDeviceSerial {
	DeviceInfoId?: String | string;
	DeviceName: String;
	Unit: String;
	EmployeeName: String;
	InstrumentDeptId?: String;
	QuantityTotal?: Number;
}

export interface IDeviceTransferHistoryItem {
	LabId: String;
	LabName: String;
	Location: String;
	DateTransfer: String;
	ExportLabId: String;
	EmployeeName: String;
}

export const dummyDeviceTransferData = {
	listDeviceInfo: [],
	listInstrument: [],
	LabId: '',
	LabName: '',
	Location: '',
};
