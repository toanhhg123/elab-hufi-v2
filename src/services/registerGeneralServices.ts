import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IRegisterGeneralType } from '../types/registerGeneralType';

const { isProd } = config;
const API_ENDPOINT = 'https://www.aspsite.somee.com';

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getRegisterGeneral = async <T> () => {
	const url = `${API_ENDPOINT}/api/registergenerals`;
	const registergenerals: T = await API.get<T>(url);
	return registergenerals;
};