import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { IExportType } from '../../types/exportType';

// Define a type for the slice state
interface IExportState {
	listOfWarehouseDepartment: IExportType[];
	listOfWarehouseLaboratory: IExportType[];
	listOfWarehouseRegisterGeneral: IExportType[];
	listOfWarehouseStudySession: IExportType[];
}

// Define the initial state using that type
const initialState: IExportState = {
	listOfWarehouseDepartment: [],
	listOfWarehouseLaboratory: [],
	listOfWarehouseRegisterGeneral: [],
	listOfWarehouseStudySession: [],
};

export const warehouseSlice = createSlice({
	name: 'warehouse',
	initialState,
	reducers: {
		setListOfWarehouseDepartment: (state: IExportState, action: PayloadAction<IExportType[]>) => {
			state.listOfWarehouseDepartment = action.payload;
		},

		setListOfWarehouseLaboratory: (state: IExportState, action: PayloadAction<IExportType[]>) => {
			state.listOfWarehouseLaboratory = action.payload;
		},

		setListOfWarehouseRegisterGeneral: (state: IExportState, action: PayloadAction<IExportType[]>) => {
			state.listOfWarehouseRegisterGeneral = action.payload;
		},

		setListOfWarehouseStudySession: (state: IExportState, action: PayloadAction<IExportType[]>) => {
			state.listOfWarehouseStudySession = action.payload;
		},
		reset: () => {
			return initialState;
		},
	},
});

export const {
	setListOfWarehouseLaboratory,
	setListOfWarehouseRegisterGeneral,
	setListOfWarehouseStudySession,
	setListOfWarehouseDepartment,
	reset
} = warehouseSlice.actions;

export default warehouseSlice.reducer;
