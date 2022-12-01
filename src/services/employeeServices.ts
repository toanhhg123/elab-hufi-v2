import config from "../configs/app"
import * as API from "../configs/apiHelper";
import { IEmployeeType } from '../types/employeeType';

const { isProd } = config;
const API_ENDPOINT = "https://www.aspsite.somee.com";


// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getEmployees = async () => {    
    const url = `${API_ENDPOINT}/api/employees`;
	const devicespec: IEmployeeType[] = await API.get<IEmployeeType[]>(url);
	return devicespec;
}

export const getEmployeeById = async (id: String) => {    
    const url = `${API_ENDPOINT}/api/employees/${id}`;
	const lab: IEmployeeType = await API.get<IEmployeeType>(url);
	return lab;
}

export const updateEmployee = async (updatedData: IEmployeeType) => {    
    const url = `${API_ENDPOINT}/api/employees`;
	const lab: IEmployeeType = await API.put<IEmployeeType, IEmployeeType>(url, updatedData);
	return lab;
}

export const deleteEmployee = async (id: String) => {    
    const url = `${API_ENDPOINT}/api/employees/${id}`;
	await API.deleteResource(url);
}

export const postEmployee = async (newLabData: IEmployeeType) => {
	const url = `${API_ENDPOINT}/api/employees`;
	const newLab: IEmployeeType = await API.post<IEmployeeType, IEmployeeType>(url, newLabData);
	return newLab;
}