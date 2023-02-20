import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IResearcherType, IResearchTeamType } from '../types/researchTeamType';

const { isProd } = config;
const API_ENDPOINT = isProd ? config.production.api_endpoint : config.development.api_endpoint;

export const getResearchTeams = async () => {
	const url = `${API_ENDPOINT}/api/teams`;
	const teams: IResearchTeamType[] = await API.get<IResearchTeamType[]>(url);
	return teams;
};

export const updateResearchTeam = async (updatedData: IResearchTeamType) => {
	const url = `${API_ENDPOINT}/api/Teams/${updatedData.TeamId}`;
	const order: IResearchTeamType = await API.put<IResearchTeamType, IResearchTeamType>(url, updatedData);
	return order;
};

export const deleteResearchTeam = async (id: String) => {
	const url = `${API_ENDPOINT}/api/Teams/${id}`;
	await API.deleteResource(url);
};

export const postResearchTeam = async (newData: IResearchTeamType) => {
	const url = `${API_ENDPOINT}/api/Teams`;
	const newOrder: IResearchTeamType = await API.post<IResearchTeamType, IResearchTeamType>(url, newData);
	return newOrder;
};

export const getResearchers = async () => {
	const url = `${API_ENDPOINT}/api/researchers`;
	const researchers: IResearcherType[] = await API.get<IResearcherType[]>(url);
	return researchers;
};

export const updateResearcher = async (updatedData: IResearcherType) => {
	const url = `${API_ENDPOINT}/api/researchers`;
	const order: IResearcherType = await API.put<IResearcherType, IResearcherType>(url, updatedData);
	return order;
};

export const deleteResearcher = async (id: String) => {
	const url = `${API_ENDPOINT}/api/researchers/${id}`;
	await API.deleteResource(url);
};

export const postResearcher = async (newData: IResearcherType) => {
	const url = `${API_ENDPOINT}/api/researchers`;
	const newOrder: IResearcherType = await API.post<IResearcherType, IResearcherType>(url, newData);
	return newOrder;
};
