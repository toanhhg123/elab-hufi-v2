import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { ISubjectType } from '../types/subjectType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getSubjects = async () => {
	const url = `${API_ENDPOINT}/api/subjects`;
	const subjects: ISubjectType[] = await API.get<ISubjectType[]>(url);
	return subjects;
};

export const getSubjectById = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/subjects/${id}`;
	const lab: ISubjectType = await API.get<ISubjectType>(url);
	return lab;
};

export const updateSubject = async (updatedData: ISubjectType) => {
	const url = `${API_ENDPOINT}/api/subjects/${updatedData?.SubjectId}`;
	const lab: ISubjectType = await API.put<ISubjectType, ISubjectType>(url, updatedData);
	return lab;
};

export const deleteSubject = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/subjects/${id}`;
	await API.deleteResource(url);
};

export const postSubject = async (newLabData: ISubjectType) => {
	const url = `${API_ENDPOINT}/api/subjects`;
	const newLab = await API.post<ISubjectType[], ISubjectType>(url, [newLabData]);
	return newLab;
};
