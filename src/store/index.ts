import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../layouts/Counter/counterSlice'
import appReducer from "../pages/appSlice"
import laboratoriesReducer from "../layouts/LaboratoriesTable/laboratoriesSlice"
import deviceSpecsReducer from "../layouts/DeviceSpecTable/deviceSpecSlice"
import employeeReducer from "../layouts/EmployeeTable/employeeSlice"
import departmentReducer from "../layouts/DepartmentTable/departmentSlice"
import manufacturerReducer from "../layouts/ManufacturerTable/manufacturerSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    app: appReducer,
    laboratories: laboratoriesReducer,
    deviceSpecs: deviceSpecsReducer,
    employee: employeeReducer,
    department: departmentReducer,
    manufacturer: manufacturerReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch