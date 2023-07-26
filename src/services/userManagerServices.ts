import { ResponseType } from 'axios';
import * as API from '../configs/apiHelper';
import config from '../configs/app';
import { IUserOwner } from '../types/userManagerType';

const { isProd } = config;
const API_ENDPOINT = isProd
	? config.production.api_endpoint
	: config.development.api_endpoint;

export const login = async (type: String, username: String, password: String) => {
	const url = `${API_ENDPOINT}/api/UserManagers/employee/login/${username}/${password}`
	const user = await API.post<any, any>(url, null);
	return user;
};
