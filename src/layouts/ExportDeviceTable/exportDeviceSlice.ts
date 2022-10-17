import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { IExportDeviceType } from '../../types/exportDeviceType';

// Define a type for the slice state
interface IExportDeviceState {
	listOfExportDevice: IExportDeviceType[];
}

// Define the initial state using that type
const initialState: IExportDeviceState = {
	listOfExportDevice: [],
};

export const exportDeviceSlice = createSlice({
	name: 'exportDevice',
	initialState,
	reducers: {
		setListOfExportDevice: (state: IExportDeviceState, action: PayloadAction<IExportDeviceType[]>) => {
			state.listOfExportDevice = action.payload;
		},
	},
});

export const { setListOfExportDevice } = exportDeviceSlice.actions;

export default exportDeviceSlice.reducer;
