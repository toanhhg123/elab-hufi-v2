import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IDepartmentType } from '../types/departmentType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getDepartments = async () => {
	const url = `${API_ENDPOINT}/api/departments`;
	const departments: IDepartmentType[] = await API.get<IDepartmentType[]>(url);
	return departments;
};

export const getDepartmentById = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/departments/${id}`;
	const lab: IDepartmentType = await API.get<IDepartmentType>(url);
	return lab;
};

export const updateDepartment = async (updatedData: IDepartmentType) => {
	const url = `${API_ENDPOINT}/api/departments/${updatedData?.DepartmentId}`;
	const lab: IDepartmentType = await API.put<IDepartmentType, IDepartmentType>(url, updatedData);
	return lab;
};

export const deleteDepartment = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/departments/${id}`;
	await API.deleteResource(url);
};

export const postDepartment = async (newLabData: IDepartmentType) => {
	const url = `${API_ENDPOINT}/api/departments`;
	const newLab = await API.post<IDepartmentType, IDepartmentType>(url, newLabData);
	return newLab;
};
