import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IStudySessionType } from '../types/studySessionType';

const { isProd } = config;
const API_ENDPOINT = 'https://www.aspsite.somee.com';

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getStudySession = async () => {
	const url = `${API_ENDPOINT}/api/schedules`;
	const suppliers: IStudySessionType[] = await API.get<IStudySessionType[]>(url);
	return suppliers;
};