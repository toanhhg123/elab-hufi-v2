import { ILiquidateDeptDevice } from './deviceType'
import { IExportDeviceType } from './exportDeviceType'
import { ILiquidateDeptInstrument } from './instrumentType'

export interface IDeviceDepartmentType {
	QuantityOriginal: Number
	QuantityExport: Number
	QuantityRemain: Number
	QuantityLiquidate: Number
	QuantityTotal: Number
	listDeviceDetail?: IDeviceDetailType[]
	listDeviceInfo?: IExportDeviceType[]
	listExportInstrument?: IExportDeviceType[]
	DeviceEnglishName: string
	DeviceId: string
	DeviceName: string
	DeviceType: 'Thiết bị' | 'Công cụ' | 'Dụng cụ'
	Standard: string
	Unit: string
	HasTrain: string
	DeviceDetailId?: string
	ImportDate: string
	ImportId: string
	InstrumentDeptId: string
}

export const dummyDeviceDepartmentData: IDeviceDepartmentType = {
	QuantityOriginal: -1,
	QuantityExport: -1,
	QuantityRemain: -1,
	QuantityLiquidate: -1,
	QuantityTotal: -1,
	listDeviceDetail: [],
	listExportInstrument: [],
	DeviceEnglishName: '',
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
}

export interface IDeviceDetailType {
	QuantityExport: Number
	QuantityRemain: Number
	QuantityLiquidate: Number
	OrderDate: string
	ManufacturerName: string
	listDeviceDept: IDeviceDeptType[]
	DeviceDetailId: string
	QuantityOriginal: Number
	Price: Number
	Model: string
	Origin: string
	ManufacturerId: Number
	DeviceId: string
	OrderId: string
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
}

export interface IDeviceDeptType {
	DepartmentName: string
	DepartmentId: Number
	ExportId: string
	DeviceInfoId: string
	SerialNumber: string
	ManufacturingDate: string
	StartGuarantee: string
	EndGuarantee: string
	DateStartUsage: string
	HoursUsageTotal: Number
	PeriodicMaintenance: Number
	Status: string
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
}

export interface ILiquidateDept {
	listDevice: ILiquidateDeptDevice[]
	listInstrument: ILiquidateDeptInstrument[]
	ExpLiquidateDeptId: string
	ExportDate: string
	Content: string
	Note: string
	EmployeeId: string
	EmployeeName: string
	DepartmentId: Number
	DepartmentName: string
	Accept: string | null
	UserAccept: string | null
}

export const dummyLiquidateDept: ILiquidateDept = {
	listDevice: [],
	listInstrument: [],
	ExpLiquidateDeptId: '',
	ExportDate: `${(Date.now() / 1000) | 0}`,
	Content: '',
	Note: '',
	EmployeeId: '',
	EmployeeName: '',
	DepartmentId: 0,
	DepartmentName: '',
	Accept: '',
	UserAccept: '',
}
