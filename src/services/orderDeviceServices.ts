import * as API from "../configs/apiHelper";
import { IOrderDeviceType } from "../types/orderDeviceType";

const API_ENDPOINT = "https://www.aspsite.somee.com";

export const getOrderDevices = async () => {
  const url = `${API_ENDPOINT}/api/OrderDevices`;
  const devices: IOrderDeviceType[] = await API.get<IOrderDeviceType[]>(url);
  return devices;
}

export const getOrderDeviceById = async (id: String) => {
  const url = `${API_ENDPOINT}/api/OrderDevices/${id}`;
  const device: IOrderDeviceType = await API.get<IOrderDeviceType>(url);
  return device;
}

export const updateOrderDevice = async (OrderId: String, DeviceId: String, updatedData: IOrderDeviceType) => {
  const url = `${API_ENDPOINT}/api/OrderDevices/${OrderId}/${DeviceId}`;
  const device: IOrderDeviceType = await API.put<IOrderDeviceType, IOrderDeviceType>(url, updatedData);
  return device;
}

export const deleteOrderDevice = async (OrderId: String, DeviceId: String) => {
  const url = `${API_ENDPOINT}/api/OrderDevices/${OrderId}/${DeviceId}`;
  await API.deleteResource(url);
}

export const postOrderDevices = async (newOrderData: IOrderDeviceType[]) => {
  const url = `${API_ENDPOINT}/api/OrderDevices`;
  const devices: IOrderDeviceType[] = await API.post<IOrderDeviceType[], IOrderDeviceType[]>(url, newOrderData);
  return devices;
}