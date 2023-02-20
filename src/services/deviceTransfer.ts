import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IDeviceTransfer } from '../types/deviceTransferType';
const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getDevicesTransfer = async () => {
	const url = `${API_ENDPOINT}/api/DeviceTransfers`;
	const devices: IDeviceTransfer[] = await API.get<IDeviceTransfer[]>(url);
	return devices;
};

export const postDeviceTransfer = async (newData: IDeviceTransfer) => {
	const url = `${API_ENDPOINT}/api/DeviceTransfers`;
	const newDevice = await API.post<IDeviceTransfer, IDeviceTransfer>(url, newData);
	return newDevice;
};

export const getInstrumentTransfer = async () => {
	const url = `${API_ENDPOINT}/api/InstrumentTransfers`;
	const devices: IDeviceTransfer[] = await API.get<IDeviceTransfer[]>(url);
	return devices;
};

export const postInstrumentTransfer = async (newData: IDeviceTransfer[]) => {
	const url = `${API_ENDPOINT}/api/InstrumentTransfers`;
	const newDevice = await API.post<IDeviceTransfer[], IDeviceTransfer>(url, newData);
	return newDevice;
};
