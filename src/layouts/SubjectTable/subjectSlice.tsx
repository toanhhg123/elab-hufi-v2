import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { ISubjectType } from '../../types/subjectType';

// Define a type for the slice state
interface ISubjectState {
	listOfSubjects: ISubjectType[];
}

// Define the initial state using that type
const initialState: ISubjectState = {
	listOfSubjects: [],
};

export const subjectSlice = createSlice({
	name: 'subject',
	initialState,
	reducers: {
		setListOfSubjects: (state: ISubjectState, action: PayloadAction<ISubjectType[]>) => {
			state.listOfSubjects = action.payload;
		},
		reset: () => {
			return initialState;
		},
	},
});

export const { setListOfSubjects, reset } = subjectSlice.actions;

export default subjectSlice.reducer;
