import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IRegisterGeneralType } from '../types/registerGeneralType';

const { isProd } = config;
const API_ENDPOINT = 'https://www.aspsite.somee.com';

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getRegisterGeneral = async <T> () => {
	const url = `${API_ENDPOINT}/api/registergenerals`;
	const suppliers: T = await API.get<T>(url);
	return suppliers;
};

// export const getSupplierById = async (id: Number) => {
//     const url = `${API_ENDPOINT}/api/suppliers/${id}`;
// 	const lab: ISupplierType = await API.get<ISupplierType>(url);
// 	return lab;
// }

// export const updateSupplier = async (updatedData: ISupplierType) => {
//     const url = `${API_ENDPOINT}/api/suppliers/${updatedData.SupplierId}`;
// 	const lab: ISupplierType = await API.put<ISupplierType, ISupplierType>(url, updatedData);
// 	return lab;
// }

// export const deleteSupplier = async (id: Number) => {
//     const url = `${API_ENDPOINT}/api/suppliers/${id}`;
// 	await API.deleteResource(url);
// }

// export const postSupplier = async (newLabData: ISupplierType) => {
// 	const url = `${API_ENDPOINT}/api/suppliers`;
// 	const newLab = await API.post<ISupplierType, ISupplierType>(url, newLabData);
// 	return newLab;
// }