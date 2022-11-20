import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ISnackbarMessage {
  isOpen: boolean,
  message: string
}

export const defaultSnackbarMessage: ISnackbarMessage = {
  isOpen: false,
  message: ""
}

interface ISidebarItem {
  isOpen: boolean,
  name: String,
  icon: String
}

interface IAppState {
  isOpenDrawer: boolean,
  sidebarItems: ISidebarItem[],
  snackbarState: ISnackbarMessage
}

export const defaultSidebarItems: ISidebarItem[] = [
  {
    "isOpen": true,
    "name": "Quản lý phòng lab",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý phòng ban",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý nhân viên",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý hoá chất",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Danh mục hoá chất",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Danh mục thiết bị",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Danh mục NSX",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Danh mục NCC",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý TKB",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý môn học",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý lớp học phần",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý bài thí nghiệm",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý xuất",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý nhập",
    "icon": ""
  },
]

// Define the initial state using that type
const initialState: IAppState = {
  isOpenDrawer: false,
  sidebarItems: defaultSidebarItems,
  snackbarState: defaultSnackbarMessage
}

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsOpenDrawer: (state: IAppState, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isOpenDrawer: action.payload
      }
    },
    setSidebarItems: (state: IAppState, action: PayloadAction<Number>) => {
      let newSidebarItems: ISidebarItem[] = state.sidebarItems.map((item: ISidebarItem, idx) => {
        if (idx === action.payload) {
          return {
            ...item,
            isOpen: true
          }
        } else {
          return {
            ...item,
            isOpen: false
          }
        }
      })

      return {
        ...state,
        sidebarItems: newSidebarItems
      };
    },
    setSnackbarMessage: (state: IAppState, action: PayloadAction<string>) => {
      return {
        ...state,
        snackbarState: {
          isOpen: action.payload ? true : false,
          message: action.payload ? action.payload : ""
        }
      }
    },
  }
})

export const { setIsOpenDrawer, setSnackbarMessage, setSidebarItems } = appSlice.actions

export default appSlice.reducer