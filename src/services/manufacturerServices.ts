import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IManufacturerType } from '../types/manufacturerType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getManufacturers = async () => {
	const url = `${API_ENDPOINT}/api/manufacturers`;
	const manufacturers: IManufacturerType[] = await API.get<IManufacturerType[]>(url);
	return manufacturers;
};

export const getManufacturersById = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/manufacturers/${id}`;
	const manufacturer: IManufacturerType = await API.get<IManufacturerType>(url);
	return manufacturer;
};

export const updateManufacturer = async (updatedData: IManufacturerType) => {
	const url = `${API_ENDPOINT}/api/manufacturers`;
	const manufacturer: IManufacturerType = await API.put<IManufacturerType, IManufacturerType>(url, updatedData);
	return manufacturer;
};

export const deleteManufacturer = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/manufacturers/${id}`;
	await API.deleteResource(url);
};

export const postManufacturer = async (newLabData: IManufacturerType) => {
	const url = `${API_ENDPOINT}/api/manufacturers`;
	const newLab: IManufacturerType = await API.post<IManufacturerType, IManufacturerType>(url, newLabData);
	return newLab;
};
