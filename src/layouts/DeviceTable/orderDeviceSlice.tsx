import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrderDeviceType } from "../../types/orderDeviceType";

// Define a type for the slice state
interface IOrderDeviceState {
  listOfOrderDevices: IOrderDeviceType[],
}

// Define the initial state using that type
const initialState: IOrderDeviceState = {
  listOfOrderDevices: [],
}

export const orderDeviceSlice = createSlice({
  name: 'orderDevice',
  initialState,
  reducers: {
    setListOfOrderDevices: (state: IOrderDeviceState, action: PayloadAction<IOrderDeviceType[]>) => {
      state.listOfOrderDevices = action.payload;
    },
  },
})

export const { setListOfOrderDevices } = orderDeviceSlice.actions;

export default orderDeviceSlice.reducer;