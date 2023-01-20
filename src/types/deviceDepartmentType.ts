import { ILiquidateDeptDevice } from './deviceType';
import { IExportDeviceType } from './exportDeviceType';
import { ILiquidateDeptInstrument } from './instrumentType';

export interface IDeviceDepartmentType {
	QuantityOriginal: Number;
	QuantityExport: Number;
	QuantityRemain: Number;
	QuantityLiquidate: Number;
	QuantityTotal: Number;
	listDeviceDetail?: IDeviceDetailType[];
	listDeviceInfo?: IExportDeviceType[];
	listExportInstrument?: IExportDeviceType[];
	DeviceId: String;
	DeviceName: String;
	DeviceType: 'Thiết bị' | 'Công cụ' | 'Dụng cụ';
	Standard: String;
	Unit: String;
	HasTrain: String;
	DeviceDetailId?: String;
	ImportDate: String;
	ImportId: String;
	InstrumentDeptId: String;
}

export const dummyDeviceDepartmentData: IDeviceDepartmentType = {
	QuantityOriginal: -1,
	QuantityExport: -1,
	QuantityRemain: -1,
	QuantityLiquidate: -1,
	QuantityTotal: -1,
	listDeviceDetail: [],
	listExportInstrument: [],
	DeviceId: '',
	DeviceName: '',
	DeviceType: 'Thiết bị',
	Standard: '',
	Unit: '',
	HasTrain: '',
	DeviceDetailId: '',
	listDeviceInfo: [],
	ImportId: '',
	ImportDate: '',
	InstrumentDeptId: '',
};

export interface IDeviceDetailType {
	QuantityExport: Number;
	QuantityRemain: Number;
	QuantityLiquidate: Number;
	OrderDate: String;
	ManufacturerName: String;
	listDeviceDept: IDeviceDeptType[];
	DeviceDetailId: String;
	QuantityOriginal: Number;
	Price: Number;
	Model: String;
	Origin: String;
	ManufacturerId: Number;
	DeviceId: String;
	OrderId: String;
}

export const dummyDeviceDetailData: IDeviceDetailType = {
	QuantityExport: -1,
	QuantityRemain: -1,
	QuantityLiquidate: -1,
	OrderDate: '',
	ManufacturerName: '',
	listDeviceDept: [],
	DeviceDetailId: '',
	QuantityOriginal: -1,
	Price: -1,
	Model: '',
	Origin: '',
	ManufacturerId: -1,
	DeviceId: '',
	OrderId: '',
};

export interface IDeviceDeptType {
	DepartmentName: String;
	DepartmentId: Number;
	ExportId: String;
	DeviceInfoId: String;
	SerialNumber: String;
	ManufacturingDate: String;
	StartGuarantee: String;
	EndGuarantee: String;
	DateStartUsage: String;
	HoursUsageTotal: Number;
	PeriodicMaintenance: Number;
	Status: String;
}

export const dummyIDeviceDeptData: IDeviceDeptType = {
	DepartmentName: '',
	DepartmentId: 0,
	ExportId: '',
	DeviceInfoId: '',
	SerialNumber: '',
	ManufacturingDate: '',
	StartGuarantee: '',
	EndGuarantee: '',
	DateStartUsage: '',
	HoursUsageTotal: 0,
	PeriodicMaintenance: 0,
	Status: '',
};

export interface ILiquidateDept {
	listDevice: ILiquidateDeptDevice[];
	listInstrument: ILiquidateDeptInstrument[];
	ExpLiquidateDeptId: String;
	ExportDate: String;
	Content: String;
	Note: String;
	EmployeeId: String;
	EmployeeName: String;
	DepartmentId: Number;
	DepartmentName: String;
	Accept: String | null;
	UserAccept: String | null;
}

export const dummyLiquidateDept: ILiquidateDept = {
	listDevice: [],
	listInstrument: [],
	ExpLiquidateDeptId: '',
	ExportDate: `${Date.now() / 1000 | 0}`,
	Content: '',
	Note: '',
	EmployeeId: '',
	EmployeeName: '',
	DepartmentId: 0,
	DepartmentName: '',
	Accept: '',
	UserAccept: '',
};
