import { IDeviceTransferHistoryItem } from './deviceTransferType';
import { IDeviceRecordUsageHours } from './deviceUsageHoursType';
import { IRepairDeviceItem } from './maintenanceDevicesType';

export interface IDeviceHistory {
	SerialNumber: String;
	DeviceId: String;
	DeviceName: String;
	Model: String;
	Standard: String;
	ManufactureName: String;
	Origin: String;
	DateReceive: String;
	DateStartUsage: String;
	SuggestId: String;
	Unit: String;
	Status: String;
	Location: String;
	HoursUsageTotal: Number;
	ExpLiquiDateDeptId: String;
    listHourUsage: IDeviceRecordUsageHours[];
    listDeviceTransfer: IDeviceTransferHistoryItem[];
    listMaintenance: IRepairDeviceItem[];
}
