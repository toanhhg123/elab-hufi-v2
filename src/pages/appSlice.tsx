import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ISnackbarMessage {
  isOpen?: boolean;
  message: string;
  color?: string;
  backgroundColor?: string;
}

export const defaultSnackbarMessage: ISnackbarMessage = {
  isOpen: false,
  message: "",
  color: "black",
  backgroundColor: "white",
};

interface ISidebarItem {
  isOpen: boolean;
  name: String;
  icon: String;
}

interface IAppState {
  isOpenDrawer: boolean;
  sidebarItems: ISidebarItem[];
  snackbarState: ISnackbarMessage;
}

export const defaultSidebarItems: ISidebarItem[] = [
  {
    isOpen: true,
    name: "Phòng lab",
    icon: "",
  },
  {
    isOpen: false,
    name: "Phòng ban",
    icon: "",
  },
  {
    isOpen: false,
    name: "Nhân viên",
    icon: "",
  },
  {
    isOpen: false,
    name: "Nhà nghiên cứu",
    icon: "",
  },
  {
    isOpen: false,
    name: "nhóm nghiên cứu",
    icon: "",
  },
  {
    isOpen: false,
    name: "Hoá chất",
    icon: "",
  },
  {
    isOpen: false,
    name: "Thiết bị",
    icon: "",
  },

  {
    isOpen: false,
    name: "Nhà sản xuất",
    icon: "",
  },
  {
    isOpen: false,
    name: "Nhà cung cấp",
    icon: "",
  },
  {
    isOpen: false,
    name: "Thời khóa biểu",
    icon: "",
  },
  {
    isOpen: false,
    name: "Môn học",
    icon: "",
  },
  {
    isOpen: false,
    name: "Lớp học phần",
    icon: "",
  },
  {
    isOpen: false,
    name: "Xuất",
    icon: "",
  },
  {
    isOpen: false,
    name: "Nhập",
    icon: "",
  },
  {
    isOpen: false,
    name: "Phiếu dự trù",
    icon: "",
  },
  {
    isOpen: false,
    name: "Phiếu đăng ký",
    icon: "",
  },
  {
    isOpen: false,
    name: "Phiếu đề nghị",
    icon: "",
  },
  {
    isOpen: false,
    name: "Điều chuyển thiết bị",
    icon: "",
  },
  {
    isOpen: false,
    name: "Lịch tập huấn",
    icon: "",
  },
  {
    isOpen: false,
    name: "QL Nhập khoa - Phân phối",
    icon: "",
  },
];

// Define the initial state using that type
const initialState: IAppState = {
  isOpenDrawer: false,
  sidebarItems: defaultSidebarItems,
  snackbarState: defaultSnackbarMessage,
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsOpenDrawer: (state: IAppState, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isOpenDrawer: action.payload,
      };
    },
    setSidebarItems: (state: IAppState, action: PayloadAction<Number>) => {
      let newSidebarItems: ISidebarItem[] = state.sidebarItems.map(
        (item: ISidebarItem, idx) => {
          if (idx === action.payload) {
            return {
              ...item,
              isOpen: true,
            };
          } else {
            return {
              ...item,
              isOpen: false,
            };
          }
        }
      );

      return {
        ...state,
        sidebarItems: newSidebarItems,
      };
    },
    setSnackbarMessage: (state: IAppState, action: PayloadAction<string>) => {
      return {
        ...state,
        snackbarState: {
          isOpen: action.payload ? true : false,
          message: action.payload ? action.payload : "",
        },
      };
    },
    setSnackbar: (
      state: IAppState,
      action: PayloadAction<ISnackbarMessage>
    ) => {
      return {
        ...state,
        snackbarState: {
          isOpen: action.payload ? true : false,
          message: action.payload ? action.payload.message : "",
          color: action.payload.hasOwnProperty("color")
            ? action.payload.color
            : state.snackbarState.color,
          backgroundColor: action.payload.hasOwnProperty("backgroundColor")
            ? action.payload.backgroundColor
            : state.snackbarState.backgroundColor,
        },
      };
    },

    reset: () => {
      return {
        isOpenDrawer: false,
        sidebarItems: defaultSidebarItems,
        snackbarState: defaultSnackbarMessage,
      };
    },
  },
});

export const {
  setIsOpenDrawer,
  setSnackbarMessage,
  setSidebarItems,
  setSnackbar,
  reset,
} = appSlice.actions;

export default appSlice.reducer;
