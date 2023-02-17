import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IDeptSummaryType, IPlanSubjectType } from '../types/planSubjectType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getPlanSubjects = async () => {
	const url = `${API_ENDPOINT}/api/plansubjects`;
	const plansubjects: IPlanSubjectType[] = await API.get<IPlanSubjectType[]>(url);
	return plansubjects;
};

export const getPlanSubjectById = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/plansubjects/${id}`;
	const plansubject: IPlanSubjectType = await API.get<IPlanSubjectType>(url);
	return plansubject;
};

export const updatePlanSubject = async (updatedData: IPlanSubjectType) => {
	const url = `${API_ENDPOINT}/api/plansubjects`;
	const lab: IPlanSubjectType = await API.put<IPlanSubjectType, IPlanSubjectType>(url, updatedData);
	return lab;
};

export const deletePlanSubject = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/plansubjects/${id}`;
	await API.deleteResource(url);
};

export const postPlanSubject = async (newLabData: IPlanSubjectType) => {
	const url = `${API_ENDPOINT}/api/plansubjects`;
	const newLab = await API.post<IPlanSubjectType, IPlanSubjectType>(url, newLabData);
	return newLab;
};

export const getPlanningSuggestion = async (semster: string, schoolyear: string, subjectId: string) => {
	const url = `${API_ENDPOINT}/api/plansubjects/${semster}/${schoolyear}/${subjectId}`;
	const suggestion = await API.get<IPlanSubjectType>(url);
	return suggestion;
};

export const getPlanningSummary = async (semster: string, schoolyear: string, deptId: string) => {
	const url = `${API_ENDPOINT}/api/plansubjects/dept/${semster}/${schoolyear}/${deptId}`;
	const suggestion = await API.get<IDeptSummaryType[]>(url);
	return suggestion;
};
