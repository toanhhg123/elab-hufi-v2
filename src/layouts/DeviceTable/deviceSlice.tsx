import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IDeviceType, IDeviceSpecType } from '../../types/deviceType'

// Define a type for the slice state
interface IDeviceState {
  listOfDevices: IDeviceType[],
  listOfDeviceSpecs: IDeviceSpecType[],
}

// Define the initial state using that type
const initialState: IDeviceState = {
    listOfDevices: [],
    listOfDeviceSpecs: []
}

export const supplierSlice = createSlice({
	name: 'device',
	initialState,
	reducers: {
		setListOfDevices: (state: IDeviceState, action: PayloadAction<IDeviceType[]>) => {
			state.listOfDevices = action.payload;
		},
		setListOfDeviceSpecs: (state: IDeviceState, action: PayloadAction<IDeviceSpecType[]>) => {
			state.listOfDeviceSpecs = action.payload;
		},
		reset: () => {
			return initialState;
		},
	},
});

export const { setListOfDevices, setListOfDeviceSpecs, reset } = supplierSlice.actions

export default supplierSlice.reducer