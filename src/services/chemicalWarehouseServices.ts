import config from "../configs/app"
import * as API from "../configs/apiHelper";
import { IChemicalWarehouseType } from "../types/chemicalWarehouseType";

const { isProd } = config;
const API_ENDPOINT = "https://www.aspsite.somee.com";


// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getChemicalWarehouseById = async (id: Number) => {    
    const url = `${API_ENDPOINT}/api/chemicals/${id}`;
	const lab: IChemicalWarehouseType[] = await API.get<IChemicalWarehouseType[]>(url);
	return lab;
}