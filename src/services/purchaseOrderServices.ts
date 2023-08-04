import * as API from "../configs/apiHelper";
import { IPurchaseOrderType } from "../types/purchaseOrderType";

const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

export const getPurchaseOrders = async () => {
  const url = `${API_ENDPOINT}/api/PurchaseOrders`;
  const orders: IPurchaseOrderType[] = await API.get<IPurchaseOrderType[]>(url);
  return orders;
};

export const getPurchaseOrderById = async (id: String) => {
  const url = `${API_ENDPOINT}/api/PurchaseOrders/${id}`;
  const order: IPurchaseOrderType = await API.get<IPurchaseOrderType>(url);
  return order;
};

export const updatePurchaseOrder = async (
  id: String,
  updatedData: IPurchaseOrderType
) => {
  const url = `${API_ENDPOINT}/api/PurchaseOrders/${id}`;
  const order: IPurchaseOrderType = await API.put<
    IPurchaseOrderType,
    IPurchaseOrderType
  >(url, updatedData);
  return order;
};

export const deletePurchaseOrder = async (id: String) => {
  const url = `${API_ENDPOINT}/api/PurchaseOrders/${id}`;
  await API.deleteResource(url);
};

export const postPurchaseOrder = async (newOrderData: IPurchaseOrderType) => {
  const url = `${API_ENDPOINT}/api/PurchaseOrders`;
  const newOrder: IPurchaseOrderType = await API.post<
    IPurchaseOrderType,
    IPurchaseOrderType
  >(url, newOrderData);
  return newOrder;
};
