import config from "../configs/app"
import * as API from "../configs/apiHelper";
import { IDeviceType } from '../types/deviceType';

const { isProd } = config;
const API_ENDPOINT = "https://www.aspsite.somee.com";


// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getDevices = async () => {    
    const url = `${API_ENDPOINT}/api/devices`;
	const devices: IDeviceType[] = await API.get<IDeviceType[]>(url);
	return devices;
}

export const getDeviceById = async (id: Number) => {    
    const url = `${API_ENDPOINT}/api/devices/${id}`;
	const lab: IDeviceType = await API.get<IDeviceType>(url);
	return lab;
}

export const updateDevice = async (updatedData: IDeviceType) => {    
    const url = `${API_ENDPOINT}/api/devices/${updatedData.DeviceId}`;
	const lab: IDeviceType = await API.put<IDeviceType, IDeviceType>(url, updatedData);
	return lab;
}

export const deleteDevice = async (id: Number) => {    
    const url = `${API_ENDPOINT}/api/devices/${id}`;
	await API.deleteResource(url);
}

export const postDevice = async (newLabData: IDeviceType) => {
	const url = `${API_ENDPOINT}/api/devices`;
	const newLab = await API.post<IDeviceType, IDeviceType>(url, newLabData);
	return newLab;
}