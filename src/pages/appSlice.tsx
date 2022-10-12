import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ISidebarItem {
  isOpen: boolean,
  name: String,
  icon: String
}

interface AppState {
  isOpenDrawer: boolean,
  sidebarItems: ISidebarItem[]
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
    "name": "Quản lý nhà sản xuất",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý hoá chất",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý nhà cung cấp",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý thiết bị",
    "icon": ""
  },
  {
    "isOpen": false,
    "name": "Quản lý thông số TB",
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
]

// Define the initial state using that type
const initialState: AppState = {
  isOpenDrawer: false,
  sidebarItems: defaultSidebarItems
}

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsOpenDrawer: (state: AppState, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isOpenDrawer: action.payload
      }
    },
    setSidebarItems: (state: AppState, action: PayloadAction<Number>) => {
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
  }
})

export const { setIsOpenDrawer, setSidebarItems } = appSlice.actions

export default appSlice.reducer