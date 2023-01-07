import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IDeviceInfo } from '../types/deviceInfoType';
import axios from 'axios';

const { isProd } = config;
const API_ENDPOINT = 'https://www.aspsite.somee.com';

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getDeviceInfoes = async () => {
	const url = `${API_ENDPOINT}/api/DeviceInfoes`;
	const deviceInfoes: IDeviceInfo[] = await API.get<IDeviceInfo[]>(url);
	return deviceInfoes;
};

export const postDeviceInfoes = async (newData: IDeviceInfo[]) => {
	const url = `${API_ENDPOINT}/api/DeviceInfoes`;
	const newDeviceInfoes = await API.post<IDeviceInfo[], IDeviceInfo[]>(url, newData);
	return newDeviceInfoes;
}

export const deleteDeviceInfoes = async (deletedData: IDeviceInfo) => {
	const url = `${API_ENDPOINT}/api/DeviceInfoes`;
	const deviceInfoes = await axios.delete(url, { data: deletedData });
	return deviceInfoes;
}

export const putDeviceInfoes = async (newData: IDeviceInfo) => {
	const url = `${API_ENDPOINT}/api/DeviceInfoes`;
	const deviceInfo = await API.put<IDeviceInfo, IDeviceInfo>(url, newData);
	return deviceInfo;
};