import * as API from "../configs/apiHelper";
import { IOrderChemicalType } from "../types/orderChemicalType";

const API_ENDPOINT = "https://www.aspsite.somee.com";

export const getOrderChemicals = async () => {
  const url = `${API_ENDPOINT}/api/OrderChemicals`;
  const chemicals: IOrderChemicalType[] = await API.get<IOrderChemicalType[]>(url);
  return chemicals;
}

export const getOrderChemicalById = async (id: String) => {
  const url = `${API_ENDPOINT}/api/OrderChemicals/${id}`;
  const chemical: IOrderChemicalType = await API.get<IOrderChemicalType>(url);
  return chemical;
}

export const updateOrderChemical = async (OrderId: String, ChemicalId: String, updatedData: IOrderChemicalType) => {
  const url = `${API_ENDPOINT}/api/OrderChemicals/${OrderId}/${ChemicalId}`;
  const chemical: IOrderChemicalType = await API.put<IOrderChemicalType, IOrderChemicalType>(url, updatedData);
  return chemical;
}

export const deleteOrderChemical = async (OrderId: String, ChemicalId: String) => {
  const url = `${API_ENDPOINT}/api/OrderChemicals/${OrderId}/${ChemicalId}`;
  await API.deleteResource(url);
}

export const postOrderChemicals = async (newOrderData: IOrderChemicalType[]) => {
  const url = `${API_ENDPOINT}/api/OrderChemicals`;
  const chemicals: IOrderChemicalType[] = await API.post<IOrderChemicalType[], IOrderChemicalType[]>(url, newOrderData);
  return chemicals;
}