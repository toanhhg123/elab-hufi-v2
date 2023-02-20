import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IDeviceDepartmentType } from '../types/deviceDepartmentType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getDevices = async (id: Number, deviceType: String) => {
	const url = `${API_ENDPOINT}/api/devices/${id}/${deviceType}`;
	const devices: IDeviceDepartmentType[] = await API.get<IDeviceDepartmentType[]>(url);
	return devices;
};

export const getDeviceById = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/devices/${id}`;
	const device: IDeviceDepartmentType[] = await API.get<IDeviceDepartmentType[]>(url);
	return device;
};

export const updateDevice = async (updatedData: any) => {
	const url = `${API_ENDPOINT}/api/devices`;
	const updatedDevice: any = await API.put<IDeviceDepartmentType, IDeviceDepartmentType>(url, updatedData);
	return updatedDevice;
};

export const deleteDevice = async (id: String) => {
	const url = `${API_ENDPOINT}/api/devices/${id}`;
	const data = await API.deleteResource(url);
	return data;
};

export const postDevice = async (newLabData: IDeviceDepartmentType[]) => {
	const url = `${API_ENDPOINT}/api/devices`;
	const newDevice = await API.post<IDeviceDepartmentType[], IDeviceDepartmentType[]>(url, newLabData);
	return newDevice;
};
