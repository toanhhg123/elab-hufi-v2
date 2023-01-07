export interface IRepairDevice {
	DeviceInfoId: String;
	SerialNumber: String;
	DeviceName: String;
	Unit: String;
	DateStartUsage: String;
    LastMaintenanceDate: String,
	listRepair: IRepairDeviceItem[];
}

export interface IRepairDeviceItem {
	RepairId: Number;
	DateCreate: String;
	Content: String;
	Cost: Number;
	Status: String;
	EmployeeName: String;
}

export const dummyRepairDeviceItem = {
	RepairId: -1,
	DateCreate: '',
	Content: '',
	Cost: 0,
	Status: '',
	EmployeeName: 'Dương Văn Thành',
}
