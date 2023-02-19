import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IEmployeeType } from '../../types/employeeType'

// Define a type for the slice state
interface IEmployeeState {
  listOfEmployees: IEmployeeType[],
}

// Define the initial state using that type
const initialState: IEmployeeState = {
    listOfEmployees: []
}

export const employeeSlice = createSlice({
	name: 'employee',
	initialState,
	reducers: {
		setListOfEmployees: (state: IEmployeeState, action: PayloadAction<IEmployeeType[]>) => {
			state.listOfEmployees = action.payload;
		},
		reset: () => {
			return initialState;
		},
	},
});

export const { setListOfEmployees, reset } = employeeSlice.actions;

export default employeeSlice.reducer