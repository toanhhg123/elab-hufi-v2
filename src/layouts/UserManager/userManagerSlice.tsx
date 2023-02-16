import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { dummyUserOwner, IUserOwner } from '../../types/userManagerType';

// Define a type for the slice state
interface IUserState {
	owner: IUserOwner;
}

// Define the initial state using that type
const initialState: IUserState = {
	owner: dummyUserOwner,
};

export const userManagerSlice = createSlice({
	name: 'userManager',
	initialState,
	reducers: {
		setOwner: (state: IUserState, action: PayloadAction<IUserOwner>) => {
			state.owner = action.payload;
		},
	},
});

export const { setOwner } = userManagerSlice.actions;

export default userManagerSlice.reducer;
