import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { ILaboratoryType } from '../../types/laboratoryType'

// Define a type for the slice state
interface ILaboratoryState {
  listOfLaboratories: ILaboratoryType[],
}

// Define the initial state using that type
const initialState: ILaboratoryState = {
    listOfLaboratories: []
}

export const laboratorySlice = createSlice({
  name: 'laboratory',
  initialState,
  reducers: {
    setListOfLaboratories: (state: ILaboratoryState, action: PayloadAction<ILaboratoryType[]>) => {
      state.listOfLaboratories = action.payload
    },
    reset: () => {
      return initialState;
    }
  },
})

export const { setListOfLaboratories, reset } = laboratorySlice.actions

export default laboratorySlice.reducer