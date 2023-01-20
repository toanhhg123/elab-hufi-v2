import config from "../configs/app"
import * as API from "../configs/apiHelper";
import { ILiquidateDeptDevice } from '../types/deviceType';
import { ILiquidateDeptInstrument } from '../types/instrumentType';
const { isProd } = config;
const API_ENDPOINT = "https://www.aspsite.somee.com";


// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getLiqidateDeptDevices = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptDevices/device/${id}`;
	const devices: ILiquidateDeptDevice[] = await API.get<ILiquidateDeptDevice[]>(url);
	return devices;
}

export const getLiqidateDeptInstruments = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptDevices/instrument/${id}`;
	const instruments: ILiquidateDeptInstrument[] = await API.get<ILiquidateDeptInstrument[]>(url);
	return instruments;
}