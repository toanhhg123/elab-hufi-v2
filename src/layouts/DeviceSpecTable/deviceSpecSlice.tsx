import React from 'react';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IDeviceSpecType } from '../../types/deviceSpecType'


// Define a type for the slice state
interface IDeviceSpecState {
  listOfDeviceSpecs: IDeviceSpecType[],
}

// Define the initial state using that type
const initialState: IDeviceSpecState = {
    listOfDeviceSpecs: []
}

export const deviceSpecSlice = createSlice({
  name: 'deviceSpec',
  initialState,
  reducers: {
    setListOfDeviceSpecs: (state: IDeviceSpecState, action: PayloadAction<IDeviceSpecType[]>) => {
      state.listOfDeviceSpecs = action.payload
    },
  },
})

export const { setListOfDeviceSpecs } = deviceSpecSlice.actions

export default deviceSpecSlice.reducer