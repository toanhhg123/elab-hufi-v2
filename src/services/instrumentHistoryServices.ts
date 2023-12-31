import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IInstrumentHistory } from '../types/instrumentHistoriesType';

const { isProd } = config;
const API_ENDPOINT = isProd
  ? config.production.api_endpoint
  : config.development.api_endpoint;

export const getInstrumentHitories = async (id: String) => {
	const url = `${API_ENDPOINT}/api/InstrumentHistories/${id}`;
	const instrumentHistories: IInstrumentHistory = await API.get<IInstrumentHistory>(url);
	return instrumentHistories;
};
