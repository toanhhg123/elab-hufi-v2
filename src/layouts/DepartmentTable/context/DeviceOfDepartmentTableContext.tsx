import { createContext, ReactNode, useContext, useState } from 'react';
import { getDevices } from '../../../services/deviveDepartmentServices';
import { IDeviceDepartmentType } from '../../../types/deviceDepartmentType';

const listDeviceType = ['Thiết bị', 'Công cụ', 'Dụng cụ'];

const DeviceOfDepartmentTableContext = createContext<ProviderValueType>({
	devices: [],
	setDeviceValues: (value: IDeviceDepartmentType[]) => {},
	loading: false,
	setLoadingValues: (value: Boolean) => {},
	deviceType: listDeviceType[0],
	setDeviceTypeValues: (value: string) => {},
	deviceData: {},
	setDeviceDataValues: (value: any) => {},
	cloneDevices: [],
	setCloneDeviceValues: (value: IDeviceDepartmentType[]) => {},
	getDeviceData: async (isDisabledLoading?: Boolean) => {},
	listDeviceType,
	id: 0,
});

export type DeviceOfDepartmentTableProviderProps = {
	children: ReactNode;
	id: Number;
};

export type ProviderValueType = {
	devices: IDeviceDepartmentType[];
	setDeviceValues: (value: IDeviceDepartmentType[]) => void;
	loading: Boolean;
	setLoadingValues: (value: Boolean) => void;
	deviceType: string;
	setDeviceTypeValues: (value: string) => void;
	deviceData: any;
	setDeviceDataValues: (value: any) => void;
	cloneDevices: IDeviceDepartmentType[];
	setCloneDeviceValues: (value: IDeviceDepartmentType[]) => void;
	getDeviceData: (isDisabledLoading?: Boolean) => Promise<void>;
	listDeviceType: string[];
	id: Number;
};

const DeviceOfDepartmentTableProvider = ({ children, id }: DeviceOfDepartmentTableProviderProps) => {
	const [devices, setDevices] = useState<IDeviceDepartmentType[]>([]);
	const [loading, setLoading] = useState<Boolean>(true);
	const [deviceType, setDeviceType] = useState<string>('Thiết bị');
	const [deviceData, setDeviceData] = useState<any>({});
	const [cloneDevices, setCloneDevices] = useState<IDeviceDepartmentType[]>([]);

	const getDeviceData = async (isDisabledLoading: Boolean = false) => {
		try {
			!isDisabledLoading && setLoading(true);
			const data: IDeviceDepartmentType[] = await getDevices(id || 0, deviceType);

			if (!deviceData[deviceType]) {
				deviceData[deviceType] = data;
				setDeviceData({ ...deviceData });
			}
			if (Array.isArray(data)) {
				setDevices(data || []);
				setCloneDevices(data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			!isDisabledLoading && setLoading(false);
		}
	};

	const setDeviceValues = (value: IDeviceDepartmentType[]) => {
		setDevices(value);
	};

	const setLoadingValues = (value: Boolean) => {
		setLoading(value);
	};

	const setDeviceTypeValues = (value: string) => {
		setDeviceType(value);
	};

	const setDeviceDataValues = (value: any) => {
		setDeviceData(value);
	};

	const setCloneDeviceValues = (value: IDeviceDepartmentType[]) => {
		setCloneDevices(value);
	};

	const value: ProviderValueType = {
		devices,
		setDeviceValues,
		loading,
		setLoadingValues,
		deviceType,
		setDeviceTypeValues,
		deviceData,
		setDeviceDataValues,
		cloneDevices,
		setCloneDeviceValues,
		getDeviceData,
		listDeviceType,
		id
	};

	return <DeviceOfDepartmentTableContext.Provider value={value}>{children}</DeviceOfDepartmentTableContext.Provider>;
};

const useDeviceOfDepartmentTableStore = () => {
	const context = useContext(DeviceOfDepartmentTableContext);

	return context;
};

const DeviceTable = ({ children, id }: DeviceOfDepartmentTableProviderProps) => {
	return <DeviceOfDepartmentTableProvider id={id}>{children}</DeviceOfDepartmentTableProvider>;
};

export { useDeviceOfDepartmentTableStore, DeviceOfDepartmentTableProvider, DeviceTable };
