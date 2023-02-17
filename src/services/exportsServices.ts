import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IExportType } from '../types/exportType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

// Call API Export Department
export const getExportsDep = async () => {
	const url = `${API_ENDPOINT}/api/exports`;
	const exports: IExportType[] = await API.get<IExportType[]>(url);
	return exports;
};

export const getExportById = async <IExportType>(id: String) => {
	const url = `${API_ENDPOINT}/api/exports/${id}`;
	const exportObj: IExportType = await API.get<IExportType>(url);
	return exportObj;
};

export const postExport = async (newExportData: any) => {
	const url = `${API_ENDPOINT}/api/exports`;
	const newExport = await API.post<IExportType, IExportType>(url, newExportData);
	return newExport;
};

export const updateExport = async (updatedData: any) => {
	const url = `${API_ENDPOINT}/api/exports`;
	const exportObj: IExportType = await API.put<IExportType, IExportType>(url, updatedData);
	return exportObj;
};

export const deleteExport = async (id: String) => {
	const url = `${API_ENDPOINT}/api/exports/${id}`;
	const data = await API.deleteResource(url);
	return data;
};

// Call API ExportLab
export const getExportsLabs = async (departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportlabs/${departmentId}`;
	const exports: IExportType[] = await API.get<IExportType[]>(url);
	return exports;
};
export const getExportsLabById = async (id: String, departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportlabs/${departmentId}/${id}`;
	const exports: IExportType = await API.get<IExportType>(url);
	return exports;
};

export const updateExportLabs = async (updateData: any, departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportlabs/${departmentId}`;
	const exportLab: IExportType = await API.put<IExportType, IExportType>(url, updateData);
	return exportLab;
};

export const postExportLabs = async (updateData: any, departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportlabs/${departmentId}`;
	const exportLab: IExportType = await API.post<IExportType, IExportType>(url, updateData);
	return exportLab;
};

export const deleteExportLabs = async (id: String) => {
	const url = `${API_ENDPOINT}/api/exportlabs/${id}`;
	const data = await API.deleteResource(url);
	return data;
};

// Call API ExportSubject
export const getExportsSubs = async (departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportsubjects/${departmentId}`;
	const exports: IExportType[] = await API.get<IExportType[]>(url);
	return exports;
};

export const getExportsSubById = async (id: String, departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportsubjects/${departmentId}/${id}`;
	const exports: IExportType = await API.get<IExportType>(url);
	return exports;
};

export const updateExportSubs = async (updateData: any, departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportsubjects/${departmentId}`;
	const exportSub: IExportType = await API.put<IExportType, IExportType>(url, updateData);
	return exportSub;
};

export const postExportSubs = async (updateData: any, departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportsubjects/${departmentId}`;
	const exportSub: IExportType = await API.post<IExportType, IExportType>(url, updateData);
	return exportSub;
};

export const deleteExportSubs = async (id: String) => {
	const url = `${API_ENDPOINT}/api/exportsubjects/${id}`;
	const data = await API.deleteResource(url);
	return data;
};

// Call API ExportRegGeneral
export const getExportsRegs = async (departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportreggenerals/${departmentId}`;
	const exports: IExportType[] = await API.get<IExportType[]>(url);
	return exports;
};

export const getExportsRegById = async (id: String, departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportreggenerals/${departmentId}/${id}`;
	const exports: IExportType = await API.get<IExportType>(url);
	return exports;
};

export const updateExportRegs = async (updateData: any, departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportreggenerals/${departmentId}`;
	const exportReg: IExportType = await API.put<IExportType, IExportType>(url, updateData);
	return exportReg;
};

export const postExportRegs = async (updateData: any, departmentId: Number) => {
	const url = `${API_ENDPOINT}/api/exportreggenerals/${departmentId}`;
	const exportReg: IExportType = await API.post<IExportType, IExportType>(url, updateData);
	return exportReg;
};

export const deleteExportRegs = async (id: String) => {
	const url = `${API_ENDPOINT}/api/exportreggenerals/${id}`;
	const data = await API.deleteResource(url);
	return data;
};
