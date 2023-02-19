import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { ISupplierType } from '../../types/supplierType'

// Define a type for the slice state
interface ISupplierState {
  listOfSuppliers: ISupplierType[],
}

// Define the initial state using that type
const initialState: ISupplierState = {
    listOfSuppliers: []
}

export const supplierSlice = createSlice({
	name: 'supplier',
	initialState,
	reducers: {
		setListOfSuppliers: (state: ISupplierState, action: PayloadAction<ISupplierType[]>) => {
			state.listOfSuppliers = action.payload;
		},
		reset: () => {
			return initialState;
		},
	},
});

export const { setListOfSuppliers, reset } = supplierSlice.actions

export default supplierSlice.reducer