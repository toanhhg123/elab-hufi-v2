import { GridSize } from '@mui/material';
import { DeviceType } from '../../../configs/enums';
import { IDeviceDepartmentType } from '../../../types/deviceDepartmentType';

export type ColumnsType = {
	id: string;
	header: String;
	type?: string;
	data?: any;
	size?: number;
	renderValue?: (...arg: any[]) => void;
	sx?: { [key: string]: string };
};

export type ColumnSizeType = {
	xs?: GridSize;
	sm?: GridSize;
	md?: GridSize;
	lg?: GridSize;
	xl?: GridSize;
};

export type DialogProps = {
	isOpen: boolean;
	onClose: () => void;
	handleSubmitDelete?: (DeviceId: String) => void;
	handleSubmitUpdate?: (updatedRow: any) => void;
	dataDelete?: IDeviceDepartmentType;
	dataUpdate?: IDeviceDepartmentType;
};

export type ErrorType = {
	id: String;
	msg: String;
};

export type RowCreateDeviceProps = {
	field: any;
	indexField: number;
	handleFormChange: (e: any, value: any, index: number) => void;
	removeFields: (index: number) => void;
};

export const columns: ColumnsType[] = [
	{
		id: 'DeviceId',
		header: 'Mã thiết bị',
		size: 120,
	},
	{
		id: 'DeviceName',
		header: 'Tên thiết bị',
		size: -1,
		sx: {
			minWidth: '200px',
		},
	},
	{
		id: 'DeviceType',
		header: 'Loại thiết bị',
		type: 'select',
		data: Object.keys(DeviceType).filter(v => isNaN(Number(v))),
		size: 180,
	},
	{
		id: 'Unit',
		header: 'Đơn vị',
		size: 120,
	},
	{
		id: 'HasTrain',
		header: 'Tập huấn',
		data: ['Có', 'Không'],
		renderValue: value => (value === 1 ? 'Có' : 'Không'),
		size: 180,
		type: 'select',
	},
	{
		id: 'Standard',
		header: 'Qui cách',
	},
];
