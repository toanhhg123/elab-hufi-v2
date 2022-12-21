export interface IDeviceUsageHours {
	SerialNumber: String;
	DeviceName: String;
	Unit: String;
	listRecordHours: IDeviceRecordUsageHours[];
}

export interface IDeviceRecordUsageHours {
	Month: Number;
	Year: Number;
	HoursUsage: Number;
	EmployeeName: String;
	DateInput: String;
}

export const dummyDeviceRecordUsageHours = {
	Month: new Date().getMonth() + 1,
	Year: new Date().getFullYear(),
	DateInput: '',
	EmployeeName: 'Dương Thị Ngọc Hân',
	HoursUsage: 1,
};
