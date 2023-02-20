import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { ILessonLabType } from '../../types/lessonLabType'

// Define a type for the slice state
interface ILessonLabState {
  listOfLessonLabs: ILessonLabType[],
}

// Define the initial state using that type
const initialState: ILessonLabState = {
    listOfLessonLabs: []
}

export const lessonLabSlice = createSlice({
	name: 'lessonLab',
	initialState,
	reducers: {
		setListOfLessonLabs: (state: ILessonLabState, action: PayloadAction<ILessonLabType[]>) => {
			state.listOfLessonLabs = action.payload;
		},
		reset: () => {
			return initialState;
		},
	},
});

export const { setListOfLessonLabs, reset } = lessonLabSlice.actions

export default lessonLabSlice.reducer