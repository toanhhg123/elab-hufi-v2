import * as API from '../configs/apiHelper';
import config from '../configs/app';
import { IUserOwner } from '../types/userManagerType';
const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getResearcherOwner = async (id: String) => {
	const url = `${API_ENDPOINT}/api/researchers/${id}`;
	const owner: IUserOwner = await API.get<IUserOwner>(url);
	return owner;
};
