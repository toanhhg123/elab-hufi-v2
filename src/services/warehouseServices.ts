import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IWarehouseType } from '../types/warehouseType';

const { isProd } = config;
const API_ENDPOINT = 'https://www.aspsite.somee.com';

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getWarehouseFeildId = async <T>(id: String, id2 = '') => {
	const url = `${API_ENDPOINT}/api/exports/${id}${`/${id2}`}`;
	const warehouse: T = await API.get<T>(url);
	return warehouse;
};

export const postWarehouse = async (id: String, newWarehouseData: any) => {
	const url = `${API_ENDPOINT}/api/exports/${id}`;
	const newWarehouse = await API.post<IWarehouseType, IWarehouseType>(url, newWarehouseData);
	return newWarehouse;
};

export const updateWarehouse = async (id1: String, id2: String, updatedData: any) => {
	const url = `${API_ENDPOINT}/api/exports/${id1}/${id2}`;
	const warehouse: IWarehouseType = await API.put<IWarehouseType, IWarehouseType>(url, updatedData);
	return warehouse;
};

export const deleteWarehouse = async (id: String) => {
	const url = `${API_ENDPOINT}/api/exports/${id}`;
	const data = await API.deleteResource(url);
	return data
};
