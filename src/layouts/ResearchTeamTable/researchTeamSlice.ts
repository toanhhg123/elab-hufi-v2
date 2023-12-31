import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  IResearchTeamType,
  IResearcherType,
  dummyResearchTeamData,
  dummyListMemberData,
} from '../../types/researchTeamType'

// Define a type for the slice state
interface IResearchTeamState {
  listOfResearchTeams: IResearchTeamType[],
  currentResearchTeam: IResearchTeamType,
  currentMemberTeam: IResearcherType,
  listOfResearchers: IResearcherType[] | IResearcherType[],
}

// Define the initial state using that type
const initialState: IResearchTeamState = {
  listOfResearchTeams: [],
  currentResearchTeam: dummyResearchTeamData,
  currentMemberTeam: dummyListMemberData,
  listOfResearchers: [],
}

export const researchTeamsSlice = createSlice({
  name: 'researchTeam',
  initialState,
  reducers: {
    setListOfResearchTeams: (state: IResearchTeamState, action: PayloadAction<IResearchTeamType[]>) => {
      state.listOfResearchTeams = action.payload;
    },
    setCurrentResearchTeam: (state: IResearchTeamState, action: PayloadAction<IResearchTeamType>) => {
      state.currentResearchTeam = action.payload
    },
    setCurrentMemberTeam: (state: IResearchTeamState, action: PayloadAction<IResearcherType>) => {
      state.currentMemberTeam = action.payload
    },
    setListOfResearchers: (state: IResearchTeamState, action: PayloadAction<IResearcherType[]>) => {
      state.listOfResearchers = action.payload
    },
    reset: () => {
      return initialState;
    },
  },
})

export const {
  setListOfResearchTeams,
  setCurrentResearchTeam,
  setCurrentMemberTeam,
  setListOfResearchers,
  reset
} = researchTeamsSlice.actions

export default researchTeamsSlice.reducer