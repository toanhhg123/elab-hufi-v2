export interface IExportDeviceType {
	DeviceName: String;
	DeviceDeptId: String;
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
	LabId?: String;
	LabName?: String;
	Location?: String;
	ExportDate?: String;
	DateTranferTo?: String;
	DateStartUsage?: String;
	HoursUsageTotal?: Number;
	PeriodicMaintenance?: Number;
	EmployeeName?: String;
	ExportId?: String;
	WarningMaintenace?: String;
	Status?: String;
}

export const dummyExportDevice: IExportDeviceType = {
	DeviceName: '',
	DeviceDeptId: '',
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
	LabId: '',
	LabName: '',
	Location: '',
	ExportDate: '',
	DateTranferTo: '',
	EmployeeName: '',
	ExportId: '',
	ExportLabId: '',
	DateStartUsage: '',
	ExpRegGeneralId: '',
	HoursUsageTotal: 0,
	PeriodicMaintenance: 0,
	WarningMaintenace: '',
};
