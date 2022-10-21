import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IStudySessionType } from '../../types/studySessionType'

// Define a type for the slice state
interface IStudySessionState {
  listOfStudySession: IStudySessionType[],
}

// Define the initial state using that type
const initialState: IStudySessionState = {
    listOfStudySession: []
}

export const studySessionSlice = createSlice({
  name: 'studySession',
  initialState,
  reducers: {
    setListOfStudySession: (state: IStudySessionState, action: PayloadAction<IStudySessionType[]>) => {
      state.listOfStudySession = action.payload
    },
  },
})

export const { setListOfStudySession } = studySessionSlice.actions

export default studySessionSlice.reducer