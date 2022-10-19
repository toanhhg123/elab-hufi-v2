import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { ISchedulerType } from '../../types/schedulerType'

// Define a type for the slice state
interface ISchedulerState {
  listOfSchedulers: ISchedulerType[],
}

// Define the initial state using that type
const initialState: ISchedulerState = {
    listOfSchedulers: []
}

export const schedulerSlice = createSlice({
  name: 'scheduler',
  initialState,
  reducers: {
    setListOfSchedulers: (state: ISchedulerState, action: PayloadAction<ISchedulerType[]>) => {
      state.listOfSchedulers = action.payload
    },
  },
})

export const { setListOfSchedulers } = schedulerSlice.actions

export default schedulerSlice.reducer