import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IRegisterGeneralType } from '../types/registerGeneralType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getRegisterGenerals = async (id: string) => {
	const url = `${API_ENDPOINT}/api/registergenerals/${id}`;
	const registergenerals: IRegisterGeneralType[] = await API.get<IRegisterGeneralType[]>(url);
	return registergenerals;
};

export const updateRegisterGeneral = async (updatedData: IRegisterGeneralType) => {
	const url = `${API_ENDPOINT}/api/RegisterGenerals/${updatedData.RegisterGeneralId}`;
	const order: IRegisterGeneralType = await API.put<IRegisterGeneralType, IRegisterGeneralType>(url, updatedData);
	return order;
};

export const deleteRegisterGeneral = async (id: String) => {
	const url = `${API_ENDPOINT}/api/RegisterGenerals/${id}`;
	await API.deleteResource(url);
};

export const postRegisterGeneral = async (newData: IRegisterGeneralType) => {
	const url = `${API_ENDPOINT}/api/RegisterGenerals`;
	const newOrder: IRegisterGeneralType = await API.post<IRegisterGeneralType, IRegisterGeneralType>(url, newData);
	return newOrder;
};
