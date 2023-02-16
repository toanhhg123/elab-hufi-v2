import config from "../configs/app"
import * as API from "../configs/apiHelper";
import { IEmployeeType } from '../types/employeeType';
import { IUserOwner } from '../types/userManagerType';

const { isProd } = config;
const API_ENDPOINT = "https://www.aspsite.somee.com";


// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getEmployees = async () => {    
    const url = `${API_ENDPOINT}/api/employees`;
	const employees: IEmployeeType[] = await API.get<IEmployeeType[]>(url);
	return employees;
}

export const getEmployeeById = async (id: String) => {    
    const url = `${API_ENDPOINT}/api/employees/${id}`;
	const employee: IEmployeeType = await API.get<IEmployeeType>(url);
	return employee;
}

export const updateEmployee = async (updatedData: IEmployeeType) => {    
    const url = `${API_ENDPOINT}/api/employees`;
	const employee: IEmployeeType = await API.put<IEmployeeType, IEmployeeType>(url, updatedData);
	return employee;
}

export const deleteEmployee = async (id: String) => {    
    const url = `${API_ENDPOINT}/api/employees/${id}`;
	await API.deleteResource(url);
}

export const postEmployee = async (employeesData: IEmployeeType) => {
	const url = `${API_ENDPOINT}/api/employees`;
	const employees: IEmployeeType = await API.post<IEmployeeType, IEmployeeType>(url, employeesData);
	return employees;
};

export const getEmployeeOwner = async () => {
	const url = `${API_ENDPOINT}/api/employees/owner`;
	const owner: IUserOwner = await API.get<IUserOwner>(url);
	return owner;
};