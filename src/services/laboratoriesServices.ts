import config from "../configs/app"
import * as API from "../configs/apiHelper";
import { ILaboratoryType } from '../types/laboratoriesType';

const { isProd } = config;
const API_ENDPOINT = "https://www.aspsite.somee.com";


// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getLaboratories = async () => {    
    const url = `${API_ENDPOINT}/api/laboratories`;
	const laboratories: ILaboratoryType[] = await API.get<ILaboratoryType[]>(url);
	return laboratories;
}

export const getLaboratoriesById = async (id: Number) => {    
    const url = `${API_ENDPOINT}/api/laboratories/${id}`;
	const lab: ILaboratoryType = await API.get<ILaboratoryType>(url);
	return lab;
}

export const updateLaboratories = async (id: Number, updatedData: ILaboratoryType) => {    
    const url = `${API_ENDPOINT}/api/laboratories/${id}`;
	const lab: ILaboratoryType = await API.put<ILaboratoryType, ILaboratoryType>(url, updatedData);
	return lab;
}

export const deleteLaboratories = async (id: Number) => {    
    const url = `${API_ENDPOINT}/api/laboratories/${id}`;
	await API.deleteResource(url);
}

export const postLaboratories = async (newLabData: ILaboratoryType) => {
	const url = `${API_ENDPOINT}/api/laboratories`;
	const newLab: ILaboratoryType = await API.post<ILaboratoryType, ILaboratoryType>(url, newLabData);
	return newLab;
}