import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import {
  IResearchTeamType,
  IListMemberType,
  dummyResearchTeamData,
  dummyListMemberData
} from '../../types/researchTeamType'

// Define a type for the slice state
interface IResearchTeamState {
  listOfResearchTeams: IResearchTeamType[],
  currentResearchTeam: IResearchTeamType,
  currentMemberTeam: IListMemberType,
}

// Define the initial state using that type
const initialState: IResearchTeamState = {
  listOfResearchTeams: [],
  currentResearchTeam: dummyResearchTeamData,
  currentMemberTeam: dummyListMemberData,
}

export const researchTeamsSlice = createSlice({
  name: 'researchTeam',
  initialState,
  reducers: {
    setListOfResearchTeams: (state: IResearchTeamState, action: PayloadAction<IResearchTeamType[]>) => {
      state.listOfResearchTeams = action.payload
    },
    setCurrentResearchTeam: (state: IResearchTeamState, action: PayloadAction<IResearchTeamType>) => {
      state.currentResearchTeam = action.payload
    },
    setCurrentMemberTeam: (state: IResearchTeamState, action: PayloadAction<IListMemberType>) => {
      state.currentMemberTeam = action.payload
    }
  },
})

export const { setListOfResearchTeams, setCurrentResearchTeam, setCurrentMemberTeam } = researchTeamsSlice.actions

export default researchTeamsSlice.reducer