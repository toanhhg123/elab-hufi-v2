import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import jwtDecode from "jwt-decode";
import { requestConfig } from "./request";
import { store } from "../store/index";
import {
  logout,
  setIsLogined,
  setOwner,
} from "../layouts/UserManager/userManagerSlice";
import { dummyUserOwner } from "../types/userManagerType";

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
    message: "An unknown error occured",
  };
  if (
    err.response &&
    err.response.data &&
    err.response.data.error &&
    err.response.data.message
  ) {
    error.code = err.response.data.error;
    error.message = err.response.data.message;
  } else if (!err.response && err.message) {
    error.message = err.message;
  }
  return error;
};

export const getFromLocalStorage = async (key: string) => {
  try {
    const serializedState = localStorage.getItem(key);
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
    localStorage.setItem(key, serializedState);
  } catch (err) {
    // Ignoring write error as of now
  }
};
export const clearFromLocalStorage = async (key: string) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    return false;
  }
};

const createAxiosClient = (
  apiConfiguration: ApiConfiguration
): AxiosInstance => {
  const newInstance = axios.create({
    responseType: "json" as const,
    headers: {
      "Content-Type": "application/json",
      ...(apiConfiguration.accessToken && {
        Authorization: `Bearer ${apiConfiguration.accessToken}`,
      }),
    },
    timeout: 10 * 1000,
  });

  newInstance.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      const user = await getFromLocalStorage("user");
      if (!user) {
        dispatch(logout());
        dispatch(setIsLogined(false));
        return config;
      }
      const date = new Date();
      const decodeToken = jwtDecode<Token>(user?.AccessToken);

      if (decodeToken.exp < date.getTime() / 1000) {
        try {
          var res = await axios.post(
            `${process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT}/api/UserManagers/refreshtoken/employee`,
            "",
            {
              headers: { Authorization: `Bearer ${user?.RefreshToken}` },
            }
          );

          if (res.data) {
            saveToLocalStorage("user", { ...res.data, type: user?.type });
            dispatch(setOwner({ ...res.data, type: `${user?.type}` }));
          }

          if (config.headers) {
            config.headers["Authorization"] = `Bearer ${
              res ? res.data.AccessToken : user.AccessToken
            }`;
          }

          dispatch(setIsLogined(true));
          return config;
        } catch (err) {
          clearFromLocalStorage("user");
          dispatch(setOwner(dummyUserOwner));
          dispatch(logout());
          dispatch(setIsLogined(false));
        }
      }
      return config;
    },
    (_err) => {
      clearFromLocalStorage("user");
      dispatch(setOwner(dummyUserOwner));
      dispatch(logout());
      dispatch(setIsLogined(false));
    }
  );
  return newInstance;
};

export interface IApiClient {
  post<TRequest, TResponse>(
    path: string,
    object: TRequest,
    config?: RequestConfig
  ): Promise<TResponse>;
  patch<TRequest, TResponse>(
    path: string,
    object: TRequest
  ): Promise<TResponse>;
  put<TRequest, TResponse>(path: string, object: TRequest): Promise<TResponse>;
  get<TResponse>(path: string): Promise<TResponse>;
}

export const get = async <TResponse>(path: string): Promise<TResponse> => {
  try {
    const userStorage = await getFromLocalStorage("user");
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

export const put = async <TRequest, TResponse>(
  path: string,
  payload: TRequest
): Promise<TResponse> => {
  try {
    const userStorage = await getFromLocalStorage("user");
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
    const userStorage = await getFromLocalStorage("user");
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
  config?: RequestConfig
): Promise<TResponse> => {
  try {
    const userStorage = await getFromLocalStorage("user");
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
