import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IClassSubjectType } from '../../types/classSubjectType'

// Define a type for the slice state
interface IClassSubjectState {
  listOfClassSubjects: IClassSubjectType[],
}

// Define the initial state using that type
const initialState: IClassSubjectState = {
    listOfClassSubjects: []
}

export const classSubjectSlice = createSlice({
	name: 'classSubject',
	initialState,
	reducers: {
		setListOfClassSubjects: (state: IClassSubjectState, action: PayloadAction<IClassSubjectType[]>) => {
			state.listOfClassSubjects = action.payload;
		},
		reset: () => {
			return initialState;
		},
	},
});

export const { setListOfClassSubjects, reset } = classSubjectSlice.actions

export default classSubjectSlice.reducer