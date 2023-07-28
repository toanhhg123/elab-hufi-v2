import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IDeviceServiceInfo } from "../../types/IDeviceServiceInfo";
import { getAll } from "../../services/PurchaseOrderDevices";

interface IState {
  data: IDeviceServiceInfo[];
  loading?: boolean;
  error?: string;
}

const initialState: IState = {
  data: [],
};

export const purchaseOrderDeviceSlice = createSlice({
  name: "purchaseOrderDeviceSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    sendRequest: (state) => {
      state.loading = true;
    },
    getAllSuccess: (_, { payload }: PayloadAction<IDeviceServiceInfo[]>) => {
      return { ...initialState, data: payload };
    },
    reset: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllAction.rejected, (state, actions) => {
      return { ...initialState, error: actions.error.message };
    });
  },
});

export const { sendRequest, reset, getAllSuccess } =
  purchaseOrderDeviceSlice.actions;

export const getAllAction = createAsyncThunk(
  "purchaseOrderDeviceSlice/getAllAction",
  async (_: undefined, { dispatch }) => {
    dispatch(sendRequest());
    dispatch(getAllSuccess(await getAll()));
  }
);

export const purchaseOrderDeviceSelect = (app: RootState) =>
  app.purchaseOrderDevice;

export default purchaseOrderDeviceSlice.reducer;
