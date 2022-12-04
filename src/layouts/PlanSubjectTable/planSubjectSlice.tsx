import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IPlanSubjectType } from '../../types/planSubjectType'

// Define a type for the slice state
interface IPlanSubjectState {
  listOfPlanSubjects: IPlanSubjectType[],
}

// Define the initial state using that type
const initialState: IPlanSubjectState = {
    listOfPlanSubjects: []
}

export const planningSubjectSlice = createSlice({
  name: 'planningSubject',
  initialState,
  reducers: {
    setListOfPlanSubjects: (state: IPlanSubjectState, action: PayloadAction<IPlanSubjectType[]>) => {
      state.listOfPlanSubjects = action.payload
    },
  },
})

export const { setListOfPlanSubjects } = planningSubjectSlice.actions

export default planningSubjectSlice.reducer