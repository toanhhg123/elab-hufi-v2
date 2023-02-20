import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IExportDeviceType } from '../types/exportDeviceType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getExportDevice = async <IExportDeviceType>() => {
	const url = `${API_ENDPOINT}/api/exportdevices`;
	const exportDevices: IExportDeviceType[] = await API.get<IExportDeviceType[]>(url);
	return exportDevices;
};

export const postExportDevices = async (newData: IExportDeviceType[]) => {
	const url = `${API_ENDPOINT}/api/exportdevices`;
	const newExportDevices: IExportDeviceType = await API.post<IExportDeviceType[], IExportDeviceType>(url, newData);
	return newExportDevices;
};

export const getExportDeviceById = async <IExportDeviceType>(id: String) => {
	const url = `${API_ENDPOINT}/api/exportdevices/${id}`;
	const exportDevice: IExportDeviceType = await API.get<IExportDeviceType>(url);
	return exportDevice;
};

export const deleteExportDevice = async (ExportId: String, DeviceId: String) => {
	const url = `${API_ENDPOINT}/api/exportdevices/${ExportId}/${DeviceId}`;
	const data = await API.deleteResource(url);
	return data;
};

export const putExportDevice = async (ExportId: String, DeviceId: String, updatedData: IExportDeviceType) => {
	const url = `${API_ENDPOINT}/api/exportdevices/${ExportId}/${DeviceId}`;
	const exportDevice: IExportDeviceType = await API.put<IExportDeviceType, IExportDeviceType>(url, updatedData);
	return exportDevice;
};
