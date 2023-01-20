import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { ITrainRegister, ITrainSchedule, ITrainDevice, ITrainInstructor, ITrainer } from '../../types/trainType';

// Define a type for the slice state
interface ITrainScheduleState {
	listOfTrainDevice: ITrainDevice[];
	listOfTrainInstructor: ITrainInstructor[];
	listOfTrainer: ITrainer[];
}

// Define the initial state using that type
const initialState: ITrainScheduleState = {
	listOfTrainDevice: [],
	listOfTrainInstructor: [],
	listOfTrainer: [],
};

export const trainScheduleSlice = createSlice({
	name: 'managerTrainSchedule',
	initialState,
	reducers: {
		setListOfTrainDevice: (state: ITrainScheduleState, action: PayloadAction<ITrainDevice[]>) => {
			state.listOfTrainDevice = action.payload;
		},

		setListOfTrainInstructor: (state: ITrainScheduleState, action: PayloadAction<ITrainInstructor[]>) => {
			state.listOfTrainInstructor = action.payload;
		},

		setListOfTrainer: (state: ITrainScheduleState, action: PayloadAction<ITrainer[]>) => {
			state.listOfTrainer = action.payload;
		},
	},
});

export const {
	setListOfTrainDevice,
	setListOfTrainInstructor,
	setListOfTrainer,
} = trainScheduleSlice.actions;

export default trainScheduleSlice.reducer;
