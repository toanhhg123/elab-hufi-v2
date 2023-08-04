import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IDeviceServiceInfo } from "../../types/IDeviceServiceInfo";
import {
  acceptPurchaseOrderDevices,
  deletePurchaseOrderDevices,
  getAll,
  noAcceptPurchaseOrderDevices,
  savePurchaseOrderDevices,
  updatePurchaseOrderDevices,
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

    updateSuccess: (_, { payload }: PayloadAction<IDeviceServiceInfo>) => {
      return {
        ...initialState,
        data: [
          ..._.data.map((x) => (x.OrderId === payload.OrderId ? payload : x)),
        ],
        successMessage: "thay đổi thành công",
      };
    },

    deleteSuccess: (_, { payload }: PayloadAction<string>) => {
      return {
        ...initialState,
        data: [..._.data.filter((x) => x.OrderId !== payload)],
        successMessage: "xoá thành công",
      };
    },

    reset: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllAction.rejected, (_, actions) => {
      return { ...initialState, error: actions.error.message };
    });

    builder.addCase(savePurchaseOrderDeviceAction.rejected, (_, actions) => {
      return { ...initialState, error: actions.error.message };
    });

    builder.addCase(acceptPurchaseOrderDeviceAction.rejected, (_, actions) => {
      return { ...initialState, error: actions.error.message };
    });

    builder.addCase(
      noAcceptPurchaseOrderDeviceAction.rejected,
      (_, actions) => {
        return { ...initialState, error: actions.error.message };
      }
    );

    builder.addCase(deletePurchaseOrderDeviceAction.rejected, (_, actions) => {
      return { ...initialState, error: actions.error.message };
    });
  },
});

export const {
  sendRequest,
  reset,
  getAllSuccess,
  createSuccess,
  updateSuccess,
  deleteSuccess,
} = purchaseOrderDeviceSlice.actions;

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

export const acceptPurchaseOrderDeviceAction = createAsyncThunk(
  "purchaseOrderDeviceSlice/acceptPurchaseOrderDeviceAction",
  async (body: IDeviceServiceInfo, { dispatch }) => {
    dispatch(sendRequest());
    await acceptPurchaseOrderDevices(body.OrderId);
    dispatch(updateSuccess(body));
  }
);

export const noAcceptPurchaseOrderDeviceAction = createAsyncThunk(
  "purchaseOrderDeviceSlice/noAcceptPurchaseOrderDeviceAction",
  async (
    record: { body: IDeviceServiceInfo; message: string },
    { dispatch }
  ) => {
    const { body, message } = record;
    dispatch(sendRequest());
    await noAcceptPurchaseOrderDevices(body.OrderId, message);
    dispatch(updateSuccess(body));
  }
);

export const updatePurchaseOrderDeviceAction = createAsyncThunk(
  "purchaseOrderDeviceSlice/updatePurchaseOrderDeviceAction",
  async (record: IDeviceServiceInfo, { dispatch }) => {
    dispatch(sendRequest());
    await updatePurchaseOrderDevices(record);
  }
);

export const deletePurchaseOrderDeviceAction = createAsyncThunk(
  "purchaseOrderDeviceSlice/deletePurchaseOrderDeviceAction",
  async (id: string, { dispatch }) => {
    dispatch(sendRequest());
    await deletePurchaseOrderDevices(id);
    dispatch(deleteSuccess(id));
  }
);

export const purchaseOrderDeviceSelect = (app: RootState) =>
  app.purchaseOrderDevice;

export default purchaseOrderDeviceSlice.reducer;
