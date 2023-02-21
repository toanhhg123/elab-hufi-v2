import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IDeviceHistory } from '../types/deviceHistoriesType';

const { isProd } = config;
const API_ENDPOINT = isProd
	? config.production.api_endpoint
	: config.development.api_endpoint;

export const getDeviceHitories = async (id: String) => {
	const url = `${API_ENDPOINT}/api/DeviceHistories/${id}`;
	const deviceHistories: IDeviceHistory = await API.get<IDeviceHistory>(url);
	return deviceHistories;
};
