import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../layouts/Counter/counterSlice';
import appReducer from '../pages/appSlice';
import laboratoryReducer from '../layouts/LaboratoryTable/laboratorySlice';
import employeeReducer from '../layouts/EmployeeTable/employeeSlice';
import departmentReducer from '../layouts/DepartmentTable/departmentSlice';
import manufacturerReducer from '../layouts/ManufacturerTable/manufacturerSlice';
import chemicalReducer from '../layouts/ChemicalTable/chemicalSlice';
import chemicalWarehouseReducer from '../layouts/ChemicalWarehouseTable/chemicalWarehouseSlice';
import supplierReducer from '../layouts/SupplierTable/supplierSlice';
import deviceReducer from '../layouts/DeviceTable/deviceSlice';
import subjectReducer from '../layouts/SubjectTable/subjectSlice';
import classSubjectReducer from '../layouts/ClassSubjectTable/classSubjectSlice';
import lessonLabReducer from '../layouts/LessonLabTable/lessonLabSlice';
import warehouseReducer from '../layouts/WarehouseTable/warehouseSlice';
import registerGeneralReducer from '../layouts/RegisterGeneralTable/registerGeneralSlice';
import purchaseOrderReducer from '../layouts/PurchaseOrderTable/purchaseOrderSlice';
import scheduleReducer from '../layouts/ScheduleTable/scheduleSlice';
import planSubjectReducer from '../layouts/PlanSubjectTable/planSubjectSlice';
import researchTeamReducer from '../layouts/ResearchTeamTable/researchTeamSlice';
import trainScheduleReducer from '../layouts/TrainSchedule/TrainScheduleSlice';
import suggestNewDeviceReducer from '../layouts/SuggestNewDevicesTable/suggestNewDeviceSlice';

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		app: appReducer,
		laboratory: laboratoryReducer,
		employee: employeeReducer,
		department: departmentReducer,
		manufacturer: manufacturerReducer,
		chemical: chemicalReducer,
		chemicalWarehouse: chemicalWarehouseReducer,
		supplier: supplierReducer,
		device: deviceReducer,
		subject: subjectReducer,
		classSubject: classSubjectReducer,
		lessonLab: lessonLabReducer,
		warehouse: warehouseReducer,
		registerGeneral: registerGeneralReducer,
		purchaseOrder: purchaseOrderReducer,
		schedule: scheduleReducer,
		planSubject: planSubjectReducer,
		researchTeam: researchTeamReducer,
		managerTrainSchedule: trainScheduleReducer,
		suggestNewDevice: suggestNewDeviceReducer
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
