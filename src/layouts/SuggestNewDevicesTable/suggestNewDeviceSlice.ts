import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
	dummyListDeviceInSuggestNewDeviceData,
	dummySuggestNewDeviceData,
	IListDeviceInSuggestNewDeviceType,
	ISuggestNewDeviceType,
} from '../../types/suggestNewDeviceType';

// Define a type for the slice state
interface IsuggestNewDeviceState {
	listOfSuggestNewDevices: ISuggestNewDeviceType[];
	currentSuggestNewDeviceForm: ISuggestNewDeviceType;
	currentSuggestNewDevice: IListDeviceInSuggestNewDeviceType;
}

// Define the initial state using that type
const initialState: IsuggestNewDeviceState = {
	listOfSuggestNewDevices: [],
	currentSuggestNewDeviceForm: dummySuggestNewDeviceData,
	currentSuggestNewDevice: dummyListDeviceInSuggestNewDeviceData,
};

export const suggestNewDeviceSlice = createSlice({
	name: 'suggestNewDevice',
	initialState,
	reducers: {
		setListOfSuggestNewDevices: (state: IsuggestNewDeviceState, action: PayloadAction<ISuggestNewDeviceType[]>) => {
			state.listOfSuggestNewDevices = action.payload;
		},
		setCurrentSuggestNewDeviceForm: (
			state: IsuggestNewDeviceState,
			action: PayloadAction<ISuggestNewDeviceType>,
		) => {
			state.currentSuggestNewDeviceForm = action.payload;
		},
		setCurrentSuggestNewDevice: (
			state: IsuggestNewDeviceState,
			action: PayloadAction<IListDeviceInSuggestNewDeviceType>,
		) => {
			state.currentSuggestNewDevice = action.payload;
		},

		reset: () => {
			return initialState;
		},
	},
});

export const { setListOfSuggestNewDevices, setCurrentSuggestNewDeviceForm, setCurrentSuggestNewDevice, reset } =
	suggestNewDeviceSlice.actions;

export default suggestNewDeviceSlice.reducer;
