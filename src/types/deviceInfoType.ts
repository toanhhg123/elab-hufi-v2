export interface IDeviceInfo {
	listDeviceInfo: IDeviceInfoItem[];
	DeviceDetailId: String;
}

export interface IDeviceInfoItem {
	DeviceInfoId: String;
	SerialNumber: String;
	ManufacturingDate: String | Number | null;
	StartGuarantee: String | Number | null;
	EndGuarantee: String | Number | null;
	DateStartUsage: String | Number | null;
	HoursUsageTotal: Number;
	PeriodicMaintenance: Number;
	Status: String;
}
