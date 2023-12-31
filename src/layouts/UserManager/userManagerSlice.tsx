import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { dummyUserOwner, IUserOwner } from '../../types/userManagerType';
import { dummyToken, IToken } from '../../types/tokenType';

// Define a type for the slice state
interface IUserState {
	owner: IUserOwner;
	isLogined: boolean;
}

// Define the initial state using that type
const initialState: IUserState = {
	owner: dummyUserOwner,
	isLogined: false,
};

export const userManagerSlice = createSlice({
	name: 'userManager',
	initialState,
	reducers: {
		setOwner: (state: IUserState, action: PayloadAction<IUserOwner>) => {
			state.owner = action.payload;
		},
		setIsLogined: (state: IUserState, action: PayloadAction<boolean>) => {
            state.isLogined = action.payload;
		},
		logout: () => {
			return {
				owner: dummyUserOwner,
				token: dummyToken,
				isLogined: false,
			};
		}
	},
});

export const { setOwner, setIsLogined, logout } = userManagerSlice.actions;

export default userManagerSlice.reducer;
