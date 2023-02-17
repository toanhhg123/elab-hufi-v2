import config from "../configs/app"
import * as API from "../configs/apiHelper";
import { ISupplierType } from '../types/supplierType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;


// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getSuppliers = async () => {
    const url = `${API_ENDPOINT}/api/suppliers`;
	const suppliers: ISupplierType[] = await API.get<ISupplierType[]>(url);
	return suppliers;
}

export const getSupplierById = async (id: Number) => {
    const url = `${API_ENDPOINT}/api/suppliers/${id}`;
	const lab: ISupplierType = await API.get<ISupplierType>(url);
	return lab;
}

export const updateSupplier = async (updatedData: ISupplierType) => {
    const url = `${API_ENDPOINT}/api/suppliers`;
	const lab: ISupplierType = await API.put<ISupplierType, ISupplierType>(url, updatedData);
	return lab;
}

export const deleteSupplier = async (id: Number) => {
    const url = `${API_ENDPOINT}/api/suppliers/${id}`;
	await API.deleteResource(url);
}

export const postSupplier = async (newLabData: ISupplierType) => {
	const url = `${API_ENDPOINT}/api/suppliers`;
	const newLab = await API.post<ISupplierType, ISupplierType>(url, newLabData);
	return newLab;
}