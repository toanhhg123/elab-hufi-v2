import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IChemicalWarehouseType } from '../../types/chemicalWarehouseType';

// Define a type for the slice state
interface IChemicalWarehouseState {
	listOfChemicalWarehouse: IChemicalWarehouseType[];
}

// Define the initial state using that type
const initialState: IChemicalWarehouseState = {
	listOfChemicalWarehouse: [],
};

export const chemicalWarehouseSlice = createSlice({
	name: 'chemicalWarehouse',
	initialState,
	reducers: {
		setListOfChemicalWarehouse: (
			state: IChemicalWarehouseState,
			action: PayloadAction<IChemicalWarehouseType[]>,
		) => {
			state.listOfChemicalWarehouse = action.payload;
		},
		reset: () => {
			return initialState;
		},
	},
});

export const { setListOfChemicalWarehouse, reset } = chemicalWarehouseSlice.actions;

export default chemicalWarehouseSlice.reducer;
