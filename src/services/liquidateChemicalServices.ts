import * as API from '../configs/apiHelper';
import config from '../configs/app';
import { ILiquidateChemical, ILiquidateChemicalItem } from '../types/chemicalWarehouseType';
const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getLiquidateDeptChemical = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptChems/chemical/${id}`;
	const chemicals: ILiquidateChemicalItem[] = await API.get<ILiquidateChemicalItem[]>(url);
	return chemicals;
};

export const getLiquidateDept = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptChems/${id}`;
	const liquidates: ILiquidateChemical[] = await API.get<ILiquidateChemical[]>(url);
	return liquidates;
};

export const postLiquidateDept = async (newData: ILiquidateChemical) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptChems`;
	const liquidates: ILiquidateChemical = await API.post<ILiquidateChemical, ILiquidateChemical>(url, newData);
	return liquidates;
};

export const updateLiquidateDept = async (updatedData: ILiquidateChemical) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptChems`;
	const liquidates: ILiquidateChemical = await API.put<ILiquidateChemical, ILiquidateChemical>(url, updatedData);
	return liquidates;
};

export const deleteLiquidateDept = async (id: String) => {
	const url = `${API_ENDPOINT}/api/ExportLiquidateDeptChems/${id}`;
	const res = await API.deleteResource(url);
	return res;
};
