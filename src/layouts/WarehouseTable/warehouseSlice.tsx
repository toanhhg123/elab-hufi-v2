import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { IWarehouseType } from '../../types/warehouseType';

// Define a type for the slice state
interface IWarehouseState {
	listOfWarehouseLaboratory: IWarehouseType[];
	listOfWarehouseRegisterGeneral: IWarehouseType[];
	listOfWarehouseStudySession: IWarehouseType[];
}

// Define the initial state using that type
const initialState: IWarehouseState = {
	listOfWarehouseLaboratory: [],
	listOfWarehouseRegisterGeneral: [],
	listOfWarehouseStudySession: [],
};

export const warehouseSlice = createSlice({
	name: 'warehouse',
	initialState,
	reducers: {
		setListOfWarehouseLaboratory: (state: IWarehouseState, action: PayloadAction<IWarehouseType[]>) => {
			state.listOfWarehouseLaboratory = action.payload;
		},

		setListOfWarehouseRegisterGeneral: (state: IWarehouseState, action: PayloadAction<IWarehouseType[]>) => {
			state.listOfWarehouseRegisterGeneral = action.payload;
		},

		setListOfWarehouseStudySession: (state: IWarehouseState, action: PayloadAction<IWarehouseType[]>) => {
			state.listOfWarehouseStudySession = action.payload;
		},
	},
});

export const { setListOfWarehouseLaboratory, setListOfWarehouseRegisterGeneral, setListOfWarehouseStudySession } =
	warehouseSlice.actions;

export default warehouseSlice.reducer;
