import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrderChemicalType } from "../../types/orderChemicalType";

// Define a type for the slice state
interface IOrderChemicalState {
  listOfOrderChemicals: IOrderChemicalType[],
}

// Define the initial state using that type
const initialState: IOrderChemicalState = {
  listOfOrderChemicals: [],
}

export const orderChemicalSlice = createSlice({
  name: 'orderChemical',
  initialState,
  reducers: {
    setListOfOrderChemicals: (state: IOrderChemicalState, action: PayloadAction<IOrderChemicalType[]>) => {
      state.listOfOrderChemicals = action.payload;
    },
  },
})

export const { setListOfOrderChemicals } = orderChemicalSlice.actions;

export default orderChemicalSlice.reducer;