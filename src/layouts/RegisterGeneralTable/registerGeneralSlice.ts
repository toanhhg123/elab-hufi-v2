import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IRegisterGeneralType } from '../../types/registerGeneralType'

// Define a type for the slice state
interface IManufacturerState {
  listOfRegisterGeneral: IRegisterGeneralType[],
}

// Define the initial state using that type
const initialState: IManufacturerState = {
    listOfRegisterGeneral: []
}

export const registerGeneralsSlice = createSlice({
  name: 'registerGeneral',
  initialState,
  reducers: {
    setListOfRegisterGeneral: (state: IManufacturerState, action: PayloadAction<IRegisterGeneralType[]>) => {
      state.listOfRegisterGeneral = action.payload
    },
  },
})

export const { setListOfRegisterGeneral } = registerGeneralsSlice.actions

export default registerGeneralsSlice.reducer