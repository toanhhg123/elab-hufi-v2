import config from "../configs/app";
import * as API from "../configs/apiHelper";
import { IDeviceServiceInfo } from "../types/IDeviceServiceInfo";

const { isProd } = config;
const API_ENDPOINT = isProd
  ? config.production.api_endpoint
  : config.development.api_endpoint;

export const getAll = async () => {
  return API.get<IDeviceServiceInfo[]>(
    `${API_ENDPOINT}/api/PurchaseOrderDevices`
  );
};
