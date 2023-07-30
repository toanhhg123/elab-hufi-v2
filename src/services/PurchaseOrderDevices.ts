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

export const getDataFile = async (file: File) => {
  const form = new FormData();
  form.append("file", file);

  return API.post<unknown, { data: IDeviceServiceInfo }>(
    `${API_ENDPOINT}/api/PurchaseOrderDevices/checkImportFile`,
    form
  );
};

export const savePurchaseOrderDevices = async (body: IDeviceServiceInfo) => {
  return API.post<unknown, { data: IDeviceServiceInfo }>(
    `${API_ENDPOINT}/api/PurchaseOrderDevices/savePurchaseOrder`,
    body
  );
};
