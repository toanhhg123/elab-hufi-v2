import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IScheduleType } from '../../types/scheduleType'

// Define a type for the slice state
interface ISchedulerState {
  listOfSchedules: IScheduleType[],
}

// Define the initial state using that type
const initialState: ISchedulerState = {
  listOfSchedules: []
}

export const schedulerSlice = createSlice({
	name: 'scheduler',
	initialState,
	reducers: {
		setListOfSchedules: (state: ISchedulerState, action: PayloadAction<IScheduleType[]>) => {
			state.listOfSchedules = action.payload;
		},
		reset: () => {
			return initialState;
		},
	},
});

export const { setListOfSchedules, reset } = schedulerSlice.actions

export default schedulerSlice.reducer