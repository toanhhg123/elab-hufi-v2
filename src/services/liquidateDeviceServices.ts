import * as API from '../configs/apiHelper';
import config from '../configs/app';
import { ILiquidateDept } from '../types/deviceDepartmentType';
import { ILiquidateDeptDevice } from '../types/deviceType';
import { ILiquidateDeptInstrument } from '../types/instrumentType';
const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getLiquidateDeptDevices = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptDevices/device/${id}`;
	const devices: ILiquidateDeptDevice[] = await API.get<ILiquidateDeptDevice[]>(url);
	return devices;
};

export const getLiquidateDeptInstruments = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptDevices/instrument/${id}`;
	const instruments: ILiquidateDeptInstrument[] = await API.get<ILiquidateDeptInstrument[]>(url);
	return instruments;
};

export const getLiquidateDept = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptDevices/${id}`;
	const liquidates: ILiquidateDept[] = await API.get<ILiquidateDept[]>(url);
	return liquidates;
};

export const postLiquidateDept = async (newData: ILiquidateDept) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptDevices`;
	const liquidates: ILiquidateDept = await API.post<ILiquidateDept, ILiquidateDept>(url, newData);
	return liquidates;
};

export const updateLiquidateDept = async (updatedData: ILiquidateDept) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptDevices`;
	const liquidates: ILiquidateDept = await API.put<ILiquidateDept, ILiquidateDept>(url, updatedData);
	return liquidates;
};

export const deleteLiquidateDept = async (id: String) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptDevices/${id}`;
	const res = await API.deleteResource(url);
	return res;
};
