import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IDepartmentType } from '../../types/departmentType'

// Define a type for the slice state
interface IDepartmentState {
  listOfDepartments: IDepartmentType[] | [],
}

// Define the initial state using that type
const initialState: IDepartmentState = {
    listOfDepartments: []
}

export const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    setListOfDepartments: (state: IDepartmentState, action: PayloadAction<IDepartmentType[]>) => {
      state.listOfDepartments = action.payload
    },
  },
})

export const { setListOfDepartments } = departmentSlice.actions

export default departmentSlice.reducer