export interface IDeviceTransfer {
	listSerial?: IDeviceSerial[];
	listInstrument?: IDeviceSerial[];
	LabId: String;
	LabName: String;
	Location: String;
}

export interface IDeviceSerial {
	SerialNumber?: String | string;
	DeviceName: String;
	Unit: String;
	EmployeeName: String;
	DeviceDeptId?: String;
	QuantityTotal?: Number;
}

export const dummyDeviceTransferData = {
	listSerial: [],
	listInstrument: [],
	LabId: '',
	LabName: '',
	Location: '',
};
