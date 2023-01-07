import config from "../configs/app"
import * as API from "../configs/apiHelper";
import { IRepairDevice } from '../types/maintenanceDevicesType';

const { isProd } = config;
const API_ENDPOINT = "https://www.aspsite.somee.com";


// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getMaintenanceDevices = async () => {    
    const url = `${API_ENDPOINT}/api/Repairs`;
	const maintenanceDevices: IRepairDevice[] = await API.get<IRepairDevice[]>(url);
	return maintenanceDevices;
}

export const postMaintenanceDevice = async (newMaintenanceDeviceData: IRepairDevice) => {
	const url = `${API_ENDPOINT}/api/Repairs`;
	const newMaintenanceDevice = await API.post<IRepairDevice, IRepairDevice>(url, newMaintenanceDeviceData);
	return newMaintenanceDevice;
}

export const updateMaintenanceDevice = async (updatedData: IRepairDevice) => {    
    const url = `${API_ENDPOINT}/api/Repairs`;
	const maintenanceDevice: IRepairDevice = await API.put<IRepairDevice, IRepairDevice>(url, updatedData);
	return maintenanceDevice;
}

export const getMaintenanceDeviceById = async (id: String) => {    
    const url = `${API_ENDPOINT}/api/Repairs/${id}`;
	const maintenanceDevice: IRepairDevice = await API.get<IRepairDevice>(url);
	return maintenanceDevice;
}

export const deleteMaintenanceDevice = async (id: String) => {    
    const url = `${API_ENDPOINT}/api/Repairs/${id}`;
	await API.deleteResource(url);
}