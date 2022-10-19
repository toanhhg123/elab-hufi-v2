import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../layouts/Counter/counterSlice';
import appReducer from '../pages/appSlice';
import laboratoryReducer from '../layouts/LaboratoryTable/laboratorySlice';
import employeeReducer from '../layouts/EmployeeTable/employeeSlice';
import departmentReducer from '../layouts/DepartmentTable/departmentSlice';
import manufacturerReducer from '../layouts/ManufacturerTable/manufacturerSlice';
import chemicalReducer from '../layouts/ChemicalTable/chemicalSlice';
import supplierReducer from '../layouts/SupplierTable/supplierSlice';
import deviceReducer from '../layouts/DeviceTable/deviceSlice';
import subjectReducer from '../layouts/SubjectTable/subjectSlice';
import classSubjectReducer from '../layouts/ClassSubjectTable/classSubjectSlice';
import lessonLabReducer from '../layouts/LessonLabTable/lessonLabSlice';
import warehouseReducer from '../layouts/WarehouseTable/warehouseSlice';
import registerGeneralReducer from '../layouts/RegisterGeneralTable/registerGeneralSlice';
import exportChemicalReducer from '../layouts/ExportChemicalTable/exportChemicalSlice';
import exportDeviceReducer from '../layouts/ExportDeviceTable/exportDeviceSlice';
import purchaseOrderReducer from '../layouts/PurchaseOrderTable/purchaseOrderSlice';
import orderChemicalReducer from '../layouts/ChemicalTable/orderChemicalSlice';
import orderDeviceReducer from '../layouts/DeviceTable/orderDeviceSlice';

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		app: appReducer,
		laboratory: laboratoryReducer,
		employee: employeeReducer,
		department: departmentReducer,
		manufacturer: manufacturerReducer,
		chemical: chemicalReducer,
		supplier: supplierReducer,
		device: deviceReducer,
		subject: subjectReducer,
		classSubject: classSubjectReducer,
		lessonLab: lessonLabReducer,
		warehouse: warehouseReducer,
		registerGeneral: registerGeneralReducer,
		exportChemical: exportChemicalReducer,
		exportDevice: exportDeviceReducer,
		purchaseOrder: purchaseOrderReducer,
		orderChemical: orderChemicalReducer,
		orderDevice: orderDeviceReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
