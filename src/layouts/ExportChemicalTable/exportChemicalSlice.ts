import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IExportChemicalType } from '../../types/exportChemicalType';

// Define a type for the slice state
interface IExportChemicalState {
	listOfExportChemical: IExportChemicalType[];
}

// Define the initial state using that type
const initialState: IExportChemicalState = {
	listOfExportChemical: [],
};

export const exportChemicalSlice = createSlice({
	name: 'exportChemical',
	initialState,
	reducers: {
		setListOfExportChemical: (state: IExportChemicalState, action: PayloadAction<IExportChemicalType[]>) => {
			state.listOfExportChemical = action.payload;
		},
	},
});

export const { setListOfExportChemical } = exportChemicalSlice.actions;

export default exportChemicalSlice.reducer;
