import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IDeviceHistory } from '../types/deviceHistoriesType';

const { isProd } = config;
const API_ENDPOINT = 'https://www.aspsite.somee.com';

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getDeviceHitories = async (id: String) => {
	const url = `${API_ENDPOINT}/api/DeviceHistories/${id}`;
	const deviceHistories: IDeviceHistory = await API.get<IDeviceHistory>(url);
	return deviceHistories;
};
