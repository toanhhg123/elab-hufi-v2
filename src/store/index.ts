import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../layouts/Counter/counterSlice'
import appReducer from "../pages/appSlice"
import laboratoryReducer from "../layouts/LaboratoryTable/laboratorySlice"
import deviceSpecsReducer from "../layouts/DeviceSpecTable/deviceSpecSlice"
import employeeReducer from "../layouts/EmployeeTable/employeeSlice"
import departmentReducer from "../layouts/DepartmentTable/departmentSlice"
import manufacturerReducer from "../layouts/ManufacturerTable/manufacturerSlice"
import chemicalReducer from "../layouts/ChemicalTable/chemicalSlice"
import supplierReducer from "../layouts/SupplierTable/supplierSlice"
import deviceReducer from "../layouts/DeviceTable/deviceSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    app: appReducer,
    laboratory: laboratoryReducer,
    deviceSpecs: deviceSpecsReducer,
    employee: employeeReducer,
    department: departmentReducer,
    manufacturer: manufacturerReducer,
    chemical: chemicalReducer,
    supplier: supplierReducer,
    device: deviceReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch