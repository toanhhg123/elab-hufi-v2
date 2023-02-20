import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IChemicalType } from '../../types/chemicalType';

// Define a type for the slice state
interface IChemicalState {
	listOfChemicals: IChemicalType[];
}

// Define the initial state using that type
const initialState: IChemicalState = {
	listOfChemicals: [],
};

export const chemicalSlice = createSlice({
	name: 'chemical',
	initialState,
	reducers: {
		setListOfChemicals: (state: IChemicalState, action: PayloadAction<IChemicalType[]>) => {
			state.listOfChemicals = action.payload;
		},
		reset: () => {
			return initialState;
		},
	},
});

export const { setListOfChemicals, reset } = chemicalSlice.actions;

export default chemicalSlice.reducer;
