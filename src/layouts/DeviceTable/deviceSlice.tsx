import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IDeviceType } from '../../types/deviceType'

// Define a type for the slice state
interface IDeviceState {
  listOfDevices: IDeviceType[],
}

// Define the initial state using that type
const initialState: IDeviceState = {
    listOfDevices: []
}

export const supplierSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setListOfDevices: (state: IDeviceState, action: PayloadAction<IDeviceType[]>) => {
      state.listOfDevices = action.payload
    },
  },
})

export const { setListOfDevices } = supplierSlice.actions

export default supplierSlice.reducer