import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IRegisterGeneralType } from '../../types/registerGeneralType'

// Define a type for the slice state
interface IManufacturerState {
  listOfRegisterGenerals: IRegisterGeneralType[],
}

// Define the initial state using that type
const initialState: IManufacturerState = {
    listOfRegisterGenerals: []
}

export const registerGeneralsSlice = createSlice({
  name: 'registerGeneral',
  initialState,
  reducers: {
    setListOfRegisterGenerals: (state: IManufacturerState, action: PayloadAction<IRegisterGeneralType[]>) => {
      state.listOfRegisterGenerals = action.payload
    },
  },
})

export const { setListOfRegisterGenerals } = registerGeneralsSlice.actions

export default registerGeneralsSlice.reducer