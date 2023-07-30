import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IDeviceServiceInfo } from "../../types/IDeviceServiceInfo";
import {
  getAll,
  savePurchaseOrderDevices,
} from "../../services/PurchaseOrderDevices";

interface IState {
  data: IDeviceServiceInfo[];
  loading?: boolean;
  error?: string;
  successMessage?: string;
}

const initialState: IState = {
  data: [],
};

export const purchaseOrderDeviceSlice = createSlice({
  name: "purchaseOrderDeviceSlice",
  initialState,
  reducers: {
    sendRequest: (state) => {
      state.loading = true;
    },
    getAllSuccess: (_, { payload }: PayloadAction<IDeviceServiceInfo[]>) => {
      return { ...initialState, data: payload };
    },

    createSuccess: (_, { payload }: PayloadAction<IDeviceServiceInfo>) => {
      return {
        ...initialState,
        data: [payload, ..._.data],
        successMessage: "lưu thành công",
      };
    },
    reset: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllAction.rejected, (state, actions) => {
      return { ...initialState, error: actions.error.message };
    });

    builder.addCase(
      savePurchaseOrderDeviceAction.rejected,
      (state, actions) => {
        return { ...initialState, error: actions.error.message };
      }
    );
  },
});

export const { sendRequest, reset, getAllSuccess, createSuccess } =
  purchaseOrderDeviceSlice.actions;

export const getAllAction = createAsyncThunk(
  "purchaseOrderDeviceSlice/getAllAction",
  async (_: undefined, { dispatch }) => {
    dispatch(sendRequest());
    dispatch(getAllSuccess(await getAll()));
  }
);

export const savePurchaseOrderDeviceAction = createAsyncThunk(
  "purchaseOrderDeviceSlice/savePurchaseOrderDeviceAction",
  async (record: IDeviceServiceInfo, { dispatch }) => {
    dispatch(sendRequest());
    await savePurchaseOrderDevices(record);
    dispatch(createSuccess(record));
  }
);

export const purchaseOrderDeviceSelect = (app: RootState) =>
  app.purchaseOrderDevice;

export default purchaseOrderDeviceSlice.reducer;
