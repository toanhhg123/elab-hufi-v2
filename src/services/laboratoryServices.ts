import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { ILaboratoryType } from '../types/laboratoryType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getLaboratories = async () => {
	const url = `${API_ENDPOINT}/api/laboratories`;
	const laboratories: ILaboratoryType[] = await API.get<ILaboratoryType[]>(url);
	return laboratories;
};

export const getLaboratoryById = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/laboratories/${id}`;
	const lab: ILaboratoryType = await API.get<ILaboratoryType>(url);
	return lab;
};

export const updateLaboratory = async (id: Number, updatedData: ILaboratoryType) => {
	const url = `${API_ENDPOINT}/api/laboratories/${id}`;
	const lab: ILaboratoryType = await API.put<ILaboratoryType, ILaboratoryType>(url, updatedData);
	return lab;
};

export const deleteLaboratory = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/laboratories/${id}`;
	await API.deleteResource(url);
};

export const postLaboratory = async (newLabData: ILaboratoryType) => {
	const url = `${API_ENDPOINT}/api/laboratories`;
	const newLab: ILaboratoryType = await API.post<ILaboratoryType, ILaboratoryType>(url, newLabData);
	return newLab;
};
