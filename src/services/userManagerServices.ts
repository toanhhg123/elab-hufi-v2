import * as API from '../configs/apiHelper';
import config from '../configs/app';
const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const login = async (type: String, username: String, password: String) => {
	const url = `${API_ENDPOINT}/api/UserManagers/${type}/login/${username}/${password}`;
	const user = await API.post<any, any>(url, null);
	return user?.data;
};
