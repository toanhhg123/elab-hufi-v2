import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IResearchTeamType } from '../../types/researchTeamType'

// Define a type for the slice state
interface IResearchTeamState {
  listOfResearchTeams: IResearchTeamType[],
}

// Define the initial state using that type
const initialState: IResearchTeamState = {
    listOfResearchTeams: []
}

export const researchTeamsSlice = createSlice({
  name: 'researchTeam',
  initialState,
  reducers: {
    setListOfResearchTeams: (state: IResearchTeamState, action: PayloadAction<IResearchTeamType[]>) => {
      state.listOfResearchTeams = action.payload
    },
  },
})

export const { setListOfResearchTeams } = researchTeamsSlice.actions

export default researchTeamsSlice.reducer