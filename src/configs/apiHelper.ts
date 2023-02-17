import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import { requestConfig } from './request';
import { store } from '../store/index';
import { setToken } from '../layouts/UserManager/userManagerSlice';
import { dummyToken } from '../types/tokenType';
import { redirect } from 'react-router-dom';

const { dispatch } = store;

export type CustomError = {
	code?: number;
	message: string;
};

export type HttpHeaders = {
	[key: string]: string;
};

export type RequestConfig = {
	headers: HttpHeaders;
};

export class ApiConfiguration {
	accessToken?: string;
}

type Token = {
	username: string;
	exp: number;
	iss: string;
	aud: string;
};

export const getCustomError = (err: any) => {
	let error: CustomError = {
		message: 'An unknown error occured',
	};
	if (err.response && err.response.data && err.response.data.error && err.response.data.message) {
		error.code = err.response.data.error;
		error.message = err.response.data.message;
	} else if (!err.response && err.message) {
		error.message = err.message;
	}
	return error;
};

export const getFromLocalStorage = async (key: string) => {
	try {
		const serializedState = await localStorage.getItem(key);
		if (serializedState === null) {
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch (err) {
		return undefined;
	}
};
export const saveToLocalStorage = async (key: string, value: any) => {
	try {
		const serializedState = JSON.stringify(value);
		await localStorage.setItem(key, serializedState);
	} catch (err) {
		// Ignoring write error as of now
	}
};
export const clearFromLocalStorage = async (key: string) => {
	try {
		await localStorage.removeItem(key);
		return true;
	} catch (err) {
		return false;
	}
};

async function getRequestConfig(apiConfig?: any) {
	let config = Object.assign({}, requestConfig);
	const session = await getFromLocalStorage('user');
	if (apiConfig) {
		config = Object.assign({}, requestConfig, apiConfig);
	}
	if (session) {
		config.headers['Authorization'] = `${JSON.parse(session).token}`;
	}
	return config;
}

// export const get = async (url: string, dataType?: any, params?: string, apiConfig?: any) => {
//   const config = await getRequestConfig(apiConfig);
//   config.params = params;
//   const resData = await axios.get(url, config);
//   return resData?.data;
// };

// export const post = async (url: string, data: any, apiConfig?: any) => {
//   const config = await getRequestConfig(apiConfig);
//   let postData = {};
//   if (
//     apiConfig &&
//     apiConfig.headers &&
//     apiConfig.headers["Content-Type"] &&
//     apiConfig.headers["Content-Type"] !== "application/json"
//   ) {
//     postData = data;
//     axios.defaults.headers.post["Content-Type"] =
//       apiConfig.headers["Content-Type"];
//   } else {
//     postData = JSON.stringify(data);
//     axios.defaults.headers.post["Content-Type"] = "application/json";
//   }
//   const request = axios.post(url, postData, config);
//   return request;
// };
// export const put = async (url: string, data: any) => {
//   const config = await getRequestConfig();
//   config.headers["Content-Type"] = "application/json";
//   const request = axios.put(url, JSON.stringify(data), config);
//   return request;
// };
// export const patch = async (url: string, data: any) => {
//   const config = await getRequestConfig();
//   config.headers["Content-Type"] = "application/json";
//   const request = axios.patch(url, JSON.stringify(data), config);
//   return request;
// };
// export const deleteResource = async (url: string) => {
//   const config = await getRequestConfig();
//   const request = axios.delete(url, config);
//   return request;
// };

const createAxiosClient = (apiConfiguration: ApiConfiguration): AxiosInstance => {
	const newInstance = axios.create({
		responseType: 'json' as const,
		headers: {
			'Content-Type': 'application/json',
			...(apiConfiguration.accessToken && {
				Authorization: `Bearer ${apiConfiguration.accessToken}`,
			}),
		},
		timeout: 10 * 1000,
	});

	newInstance.interceptors.request.use(
		async (config: AxiosRequestConfig) => {
			const user = await getFromLocalStorage('user');
			if (!user) {
				redirect('/login');
				return config;
			}
			const date = new Date();
			const decodeToken = jwtDecode<Token>(user?.AccessToken);

			if (decodeToken.exp < date.getTime() / 1000) {
				try {
					var res = await axios.post(
						`${process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT}/api/UserManagers/refreshtoken/${user?.type}`,
						'',
						{
							headers: { Authorization: `Bearer ${user?.RefreshToken}` },
						},
					);

					if (res.data) {
						saveToLocalStorage('user', { ...res.data, type: user?.type });
						dispatch(setToken(res.data));
					}

					if (config.headers) {
						config.headers['Authorization'] = `Bearer ${res ? res.data.accessToken : user.accessToken}`;
					}
				} catch (err) {
					clearFromLocalStorage('user');
					dispatch(setToken(dummyToken));
					redirect('/login');
				}
			}

			redirect('/');
			return config;
		},
		err => {
			clearFromLocalStorage('user');
			dispatch(setToken(dummyToken));
			redirect('login');
		},
	);
	return newInstance;
};

export interface IApiClient {
	post<TRequest, TResponse>(path: string, object: TRequest, config?: RequestConfig): Promise<TResponse>;
	patch<TRequest, TResponse>(path: string, object: TRequest): Promise<TResponse>;
	put<TRequest, TResponse>(path: string, object: TRequest): Promise<TResponse>;
	get<TResponse>(path: string): Promise<TResponse>;
}

export const get = async <TResponse>(path: string): Promise<TResponse> => {
	try {
		const userStorage = await getFromLocalStorage('user');
		const newAxios = createAxiosClient({
			accessToken: userStorage?.AccessToken,
		});
		const response = await newAxios.get<TResponse>(path);
		return response.data;
	} catch (error) {
		// handleServiceError(error);
	}
	return {} as TResponse;
};

export const put = async <TRequest, TResponse>(path: string, payload: TRequest): Promise<TResponse> => {
	try {
		const userStorage = await getFromLocalStorage('user');
		const newAxios = createAxiosClient({
			accessToken: userStorage?.AccessToken,
		});
		const response = await newAxios.put<TRequest, TResponse>(path, payload);
		return response;
	} catch (error) {
		// handleServiceError(error);
	}
	return {} as TResponse;
};

export const deleteResource = async (path: string): Promise<any> => {
	try {
		const userStorage = await getFromLocalStorage('user');
		const newAxios = createAxiosClient({
			accessToken: userStorage?.AccessToken,
		});
		const response = await newAxios.delete(path);
		return response;
	} catch (error) {
		// handleServiceError(error);
	}
};

export const post = async <TRequest, TResponse>(
	path: string,
	payload: TRequest,
	config?: RequestConfig,
): Promise<TResponse> => {
	try {
		const userStorage = await getFromLocalStorage('user');
		const newAxios = createAxiosClient({
			accessToken: userStorage?.AccessToken,
		});
		const response = config
			? await newAxios.post<TRequest, TResponse>(path, payload, config)
			: await newAxios.post<TRequest, TResponse>(path, payload);

		return response;
	} catch (error) {
		// handleServiceError(error);
	}
	return {} as TResponse;
};
