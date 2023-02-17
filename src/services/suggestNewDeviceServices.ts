import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IAcceptNewDevicesType, ISuggestNewDeviceType } from '../types/suggestNewDeviceType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getSuggestNewDevices = async (id: Number | string) => {
	const url = `${API_ENDPOINT}/api/suggestNewDevices/${id}`;
	const suggestNewDevices: ISuggestNewDeviceType[] = await API.get<ISuggestNewDeviceType[]>(url);
	return suggestNewDevices;
};

export const getSuggestNewDeviceById = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/suggestNewDevices/${id}`;
	const suggestNewDevice: ISuggestNewDeviceType = await API.get<ISuggestNewDeviceType>(url);
	return suggestNewDevice;
};

export const updateSuggestNewDevice = async (updatedData: ISuggestNewDeviceType) => {
	const url = `${API_ENDPOINT}/api/suggestNewDevices/${updatedData?.SuggestId}`;
	const suggestNewDevice: ISuggestNewDeviceType = await API.put<ISuggestNewDeviceType, ISuggestNewDeviceType>(
		url,
		updatedData,
	);
	return suggestNewDevice;
};

export const deleteSuggestNewDevice = async (id: Number | String) => {
	const url = `${API_ENDPOINT}/api/suggestNewDevices/${id}`;
	await API.deleteResource(url);
};

export const postSuggestNewDevice = async (newSuggestNewDeviceData: ISuggestNewDeviceType) => {
	const url = `${API_ENDPOINT}/api/suggestNewDevices`;
	const newSuggestNewDevice = await API.post<ISuggestNewDeviceType[], ISuggestNewDeviceType>(url, [
		newSuggestNewDeviceData,
	]);
	return newSuggestNewDevice;
};

export const getAcceptNewDevices = async (id: Number | string) => {
	const url = `${API_ENDPOINT}/api/AcceptNewDevices/${id}`;
	const acceptNewDevices: IAcceptNewDevicesType = await API.get<IAcceptNewDevicesType>(url);
	return acceptNewDevices;
};

export const postAcceptNewDevices = async (newAcceptDevices: IAcceptNewDevicesType) => {
	const url = `${API_ENDPOINT}/api/AcceptNewDevices`;
	const acceptNewDevice: IAcceptNewDevicesType = await API.post<IAcceptNewDevicesType, IAcceptNewDevicesType>(
		url,
		newAcceptDevices,
	);
	return acceptNewDevice;
};
