import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  dummyPOChemical,
  dummyPODevice,
  dummyPurchaseOrderData,
  IOrderChemicalType,
  IOrderDeviceType,
  IPurchaseOrderType
} from "../../types/purchaseOrderType";

// Define a type for the slice state
interface IPurchaseOrderState {
  listOfPurchaseOrders: IPurchaseOrderType[],
  currentPurchaseOrder: IPurchaseOrderType,
  currentChemicalPO: IOrderChemicalType,
  currentDevicePO: IOrderDeviceType
}

// Define the initial state using that type
const initialState: IPurchaseOrderState = {
  listOfPurchaseOrders: [],
  currentPurchaseOrder: dummyPurchaseOrderData,
  currentChemicalPO: dummyPOChemical,
  currentDevicePO: dummyPODevice
}

export const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState,
  reducers: {
    setListOfPurchaseOrders: (state: IPurchaseOrderState, action: PayloadAction<IPurchaseOrderType[]>) => {
      state.listOfPurchaseOrders = action.payload;
    },
    setCurrentPurchaseOrder: (state: IPurchaseOrderState, action: PayloadAction<IPurchaseOrderType>) => {
      state.currentPurchaseOrder = action.payload;
    },
    setCurrentChemicalPO: (state: IPurchaseOrderState, action: PayloadAction<IOrderChemicalType>) => {
      state.currentChemicalPO = action.payload;
    },
    setCurrentDevicePO: (state: IPurchaseOrderState, action: PayloadAction<IOrderDeviceType>) => {
      state.currentDevicePO = action.payload;
    },
  },
})

export const {
  setListOfPurchaseOrders,
  setCurrentPurchaseOrder,
  setCurrentChemicalPO,
  setCurrentDevicePO
} = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;