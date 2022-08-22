import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


// Define a type for the slice state
interface AppState {
  isOpenDrawer: boolean
}

// Define the initial state using that type
const initialState: AppState = {
    isOpenDrawer: false,
}

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsOpenDrawer: (state: AppState, action: PayloadAction<boolean>) =>{return {...state, isOpenDrawer: action.payload}}
  },
})

export const { setIsOpenDrawer } = appSlice.actions

export default appSlice.reducer