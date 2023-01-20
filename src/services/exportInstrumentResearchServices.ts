import * as API from '../configs/apiHelper';
import config from '../configs/app';
import { IExportInstrumentResearch,IExportInstrumentResearchItem } from '../types/exportInstrumentResearchType';
const { isProd } = config;
const API_ENDPOINT = 'https://www.aspsite.somee.com';

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getInstruments = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/ExportInstrumentResearchs/instrument/${id}`;
	const instruments: IExportInstrumentResearchItem[] = await API.get<IExportInstrumentResearchItem[]>(url);
	return instruments;
}

export const getExportInstrumentResearchs = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/ExportInstrumentResearchs/${id}`;
	const researchs: IExportInstrumentResearch[] = await API.get<IExportInstrumentResearch[]>(url);
	return researchs;
};

export const getExportInstrumentResearchById = async (deptId: Number, expId: String) => {
	const url = `${API_ENDPOINT}/api/ExportInstrumentResearchs/${deptId}/${expId}`;
	const researchs: IExportInstrumentResearch = await API.get<IExportInstrumentResearch>(url);
	return researchs;
};

export const postExportInstrumentResearchs = async (newData: IExportInstrumentResearch) => {
	const url = `${API_ENDPOINT}/api/ExportInstrumentResearchs`;
	const researchs: IExportInstrumentResearch = await API.post<IExportInstrumentResearch, IExportInstrumentResearch>(url, newData);
	return researchs;
};

export const updateExportInstrumentResearchs = async (updatedData: IExportInstrumentResearch) => {
	const url = `${API_ENDPOINT}/api/ExportInstrumentResearchs`;
	const researchs: IExportInstrumentResearch = await API.put<IExportInstrumentResearch, IExportInstrumentResearch>(url, updatedData);
	return researchs;
};

export const deleteExportInstrumentResearchs = async (id: String) => {
	const url = `${API_ENDPOINT}/api/ExportInstrumentResearchs/${id}`;
	const res = await API.deleteResource(url);
	return res;
};
