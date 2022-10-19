import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPurchaseOrderType } from "../../types/purchaseOrderType";

// Define a type for the slice state
interface IPurchaseOrderState {
    listOfPurchaseOrders: IPurchaseOrderType[],
}

// Define the initial state using that type
const initialState: IPurchaseOrderState = {
    listOfPurchaseOrders: [],
}

export const purchaseOrderSlice = createSlice({
    name: 'purchaseOrder',
    initialState,
    reducers: {
      setListOfPurchaseOrders: (state: IPurchaseOrderState, action: PayloadAction<IPurchaseOrderType[]>) => {
        state.listOfPurchaseOrders = action.payload;
      },
    },
})

export const {setListOfPurchaseOrders} = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;