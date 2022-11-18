export interface IExportDeviceType {
	DeviceName: String;
	ExpDeviceDeptId: String;
	ExportLabId?: String;
	QuantityOriginal: Number;
	ExpRegGeneralId?: String;
	Unit: String;
	DeviceDetailId?: String;
	SerialNumber?: String;
	ManufacturingDate?: String;
	StartGuarantee?: String;
	EndGuarantee?: String;
	YearStartUsage?: Number;
	HoursUsage?: Number;
	Quantity?: Number;
	LabId?: Number;
	LabName?: String;
	Location?: String;
	ExportDate?: String;
	EmployeeName?: String;
	ExportId?: String;
}

export const dummyExportDevice: IExportDeviceType = {
	DeviceName: '',
	ExpDeviceDeptId: '',
	QuantityOriginal: 0,
	Unit: '',
	DeviceDetailId: '',
	SerialNumber: '',
	ManufacturingDate: '',
	StartGuarantee: '',
	EndGuarantee: '',
	YearStartUsage: 0,
	HoursUsage: 0,
	Quantity: 0,
	LabId: 0,
	LabName: '',
	Location: '',
	ExportDate: '',
	EmployeeName: '',
	ExportId: '',
	ExportLabId: '',
	ExpRegGeneralId: ''
};
