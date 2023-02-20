import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IDeviceUsageHours } from '../types/deviceUsageHoursType';
import axios from 'axios';
const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getRecordHours = async () => {
	const url = `${API_ENDPOINT}/api/RecordHours`;
	const records: IDeviceUsageHours[] = await API.get<IDeviceUsageHours[]>(url);
	return records;
};

export const postRecordHours = async (newData: IDeviceUsageHours) => {
	const url = `${API_ENDPOINT}/api/RecordHours`;
	const records = await API.post<IDeviceUsageHours, IDeviceUsageHours>(url, newData);
	return records;
};

export const putRecordHours = async (newData: IDeviceUsageHours) => {
	const url = `${API_ENDPOINT}/api/RecordHours`;
	const records = await API.put<IDeviceUsageHours, IDeviceUsageHours>(url, newData);
	return records;
};

export const deleteRecordHours = async (deleteData: IDeviceUsageHours) => {
	const url = `${API_ENDPOINT}/api/RecordHours`;
	const records = await axios.delete(url, { data: deleteData });
	return records;
};
