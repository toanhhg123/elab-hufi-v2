import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IClassSubjectType } from '../types/classSubjectType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getClassSubjects = async () => {
	const url = `${API_ENDPOINT}/api/classSubjects`;
	const classSubjects: IClassSubjectType[] = await API.get<IClassSubjectType[]>(url);
	return classSubjects;
};

export const getClassSubjectById = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/classSubjects/${id}`;
	const lab: IClassSubjectType = await API.get<IClassSubjectType>(url);
	return lab;
};

export const updateClassSubject = async (updatedData: IClassSubjectType) => {
	const url = `${API_ENDPOINT}/api/classSubjects/${updatedData?.ClassId}`;
	const lab: IClassSubjectType = await API.put<IClassSubjectType, IClassSubjectType>(url, updatedData);
	return lab;
};

export const deleteClassSubject = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/classSubjects/${id}`;
	await API.deleteResource(url);
};

export const postClassSubject = async (newLabData: IClassSubjectType) => {
	const url = `${API_ENDPOINT}/api/classSubjects`;
	const newLab = await API.post<IClassSubjectType[], IClassSubjectType>(url, [newLabData]);
	return newLab;
};
