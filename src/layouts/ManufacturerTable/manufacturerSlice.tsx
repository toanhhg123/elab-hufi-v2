import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IManufacturerType } from '../../types/manufacturerType'

// Define a type for the slice state
interface IManufacturerState {
  listOfManufacturers: IManufacturerType[],
}

// Define the initial state using that type
const initialState: IManufacturerState = {
    listOfManufacturers: []
}

export const laboratoriesSlice = createSlice({
	name: 'manufacturer',
	initialState,
	reducers: {
		setListOfManufacturers: (state: IManufacturerState, action: PayloadAction<IManufacturerType[]>) => {
			state.listOfManufacturers = action.payload;
		},

		reset: () => {
			return initialState;
		},
	},
});

export const { setListOfManufacturers, reset } = laboratoriesSlice.actions

export default laboratoriesSlice.reducer