import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { ILaboratoryType } from '../../types/laboratoriesType'

// Define a type for the slice state
interface ILaboratoryState {
  listOfLaboratories: ILaboratoryType[],
}

// Define the initial state using that type
const initialState: ILaboratoryState = {
    listOfLaboratories: []
}

export const laboratoriesSlice = createSlice({
  name: 'laboratories',
  initialState,
  reducers: {
    setListOfLaboratories: (state: ILaboratoryState, action: PayloadAction<ILaboratoryType[]>) => {
      state.listOfLaboratories = action.payload
    },
  },
})

export const { setListOfLaboratories } = laboratoriesSlice.actions

export default laboratoriesSlice.reducer