import config from "../configs/app"
import * as API from "../configs/apiHelper";
const { isProd } = config;
const API_ENDPOINT = isProd
  ? config.production.api_endpoint
  : config.development.api_endpoint;

// define type params: APIRequestParams

// example GET API request
export const getTest = () => {
		// const { param1, param2 } = params;
		// const url = `${API_ENDPOINT}/get_request?param1=${param1}&param2=${param2}`;
    const url = 'http://www.aspsite.somee.com/api/EmployeeAPI';
	return API.get(url);
}