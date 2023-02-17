import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { dummyUserOwner, IUserOwner } from '../../types/userManagerType';
import { dummyToken, IToken } from '../../types/tokenType';

// Define a type for the slice state
interface IUserState {
	owner: IUserOwner;
	token: IToken;
}

// Define the initial state using that type
const initialState: IUserState = {
	owner: dummyUserOwner,
	token: dummyToken,
};

export const userManagerSlice = createSlice({
	name: 'userManager',
	initialState,
	reducers: {
		setOwner: (state: IUserState, action: PayloadAction<IUserOwner>) => {
			state.owner = action.payload;
		},

		setToken: (state: IUserState, action: PayloadAction<IToken>) => {
            state.token = action.payload;
		},
	},
});

export const { setOwner, setToken } = userManagerSlice.actions;

export default userManagerSlice.reducer;
