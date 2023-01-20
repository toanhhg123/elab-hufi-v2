import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IResearchTeamType } from '../types/researchTeamType';

const { isProd } = config;
const API_ENDPOINT = 'https://www.aspsite.somee.com';

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getResearchTeams = async () => {
	const url = `${API_ENDPOINT}/api/teams`;
	const teams: IResearchTeamType[] = await API.get<IResearchTeamType[]>(url);
	return teams;
};

export const updateResearchTeam = async (updatedData: IResearchTeamType) => {    
    const url = `${API_ENDPOINT}/api/Teams/${updatedData.TeamId}`;
	const order: IResearchTeamType = await API.put<IResearchTeamType, IResearchTeamType>(url, updatedData);
	return order;
}

export const deleteResearchTeam = async (id: String) => {    
    const url = `${API_ENDPOINT}/api/Teams/${id}`;
	await API.deleteResource(url);
}

export const postResearchTeam = async (newData: IResearchTeamType) => {
	const url = `${API_ENDPOINT}/api/Teams`;
	const newOrder: IResearchTeamType = await API.post<IResearchTeamType, IResearchTeamType>(url, newData);
	return newOrder;
}