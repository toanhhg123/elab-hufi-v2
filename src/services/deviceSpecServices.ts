import config from "../configs/app"
import * as API from "../configs/apiHelper";
import { IDeviceSpecType } from '../types/deviceSpecType';

const { isProd } = config;
const API_ENDPOINT = "https://www.aspsite.somee.com";


// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getDeviceSpec = async () => {    
    const url = `${API_ENDPOINT}/api/devicespecs`;
	const devicespec: IDeviceSpecType[] = await API.get<IDeviceSpecType[]>(url);
	return devicespec;
}

export const getDeviceSpecById = async (id: Number) => {    
    const url = `${API_ENDPOINT}/api/devicespecs/${id}`;
	const lab: IDeviceSpecType = await API.get<IDeviceSpecType>(url);
	return lab;
}

export const updateDeviceSpec = async (updatedData: IDeviceSpecType) => {    
    const url = `${API_ENDPOINT}/api/devicespecs/${updatedData.DeviceId}/${updatedData.SpecsID}`;
	const lab: IDeviceSpecType = await API.put<IDeviceSpecType, IDeviceSpecType>(url, updatedData);
	return lab;
}

export const deleteDeviceSpec = async (deletedData: IDeviceSpecType) => {    
    const url = `${API_ENDPOINT}/api/devicespecs/${deletedData.DeviceId}/${deletedData.SpecsID}`;
	await API.deleteResource(url);
}

export const postDeviceSpec = async (newLabData: IDeviceSpecType) => {
	const url = `${API_ENDPOINT}/api/devicespecs`;
	const newLab: IDeviceSpecType = await API.post<IDeviceSpecType, IDeviceSpecType>(url, newLabData);
	return newLab;
}