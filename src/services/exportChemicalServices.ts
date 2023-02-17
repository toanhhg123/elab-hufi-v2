import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IExportChemicalType } from '../types/exportChemicalType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getExportChemical = async <IExportChemicalType>() => {
	const url = `${API_ENDPOINT}/api/exportchemicals`;
	const exportChemicals: IExportChemicalType[] = await API.get<IExportChemicalType[]>(url);
	return exportChemicals;
};

export const postExportChemicals = async (newData: IExportChemicalType[]) => {
	const url = `${API_ENDPOINT}/api/exportchemicals`;
	const newExportChemicals: IExportChemicalType = await API.post<IExportChemicalType[], IExportChemicalType>(
		url,
		newData,
	);
	return newExportChemicals;
};

export const getExportChemicalById = async <IExportChemicalType>(id: String) => {
	const url = `${API_ENDPOINT}/api/exportchemicals/${id}`;
	const exportChemical: IExportChemicalType = await API.get<IExportChemicalType>(url);
	return exportChemical;
};

export const deleteExportChemical = async (ExportId: String, ChemicalId: String) => {
	const url = `${API_ENDPOINT}/api/exportchemicals/${ExportId}/${ChemicalId}`;
	const data = await API.deleteResource(url);
	return data;
};

export const putExportChemical = async (ExportId: String, ChemicalId: String, updatedData: IExportChemicalType) => {
	const url = `${API_ENDPOINT}/api/exportchemicals/${ExportId}/${ChemicalId}`;
	const exportChemical: IExportChemicalType = await API.put<IExportChemicalType, IExportChemicalType>(
		url,
		updatedData,
	);
	return exportChemical;
};
