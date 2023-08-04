import { configureStore, Middleware } from "@reduxjs/toolkit";
import chemicalReducer, {
  reset as chemicalReset,
} from "../layouts/ChemicalTable/chemicalSlice";
import chemicalWarehouseReducer, {
  reset as chemicalWarehouseReset,
} from "../layouts/ChemicalWarehouseTable/chemicalWarehouseSlice";
import classSubjectReducer, {
  reset as classSubjectReset,
} from "../layouts/ClassSubjectTable/classSubjectSlice";
import counterReducer from "../layouts/Counter/counterSlice";
import departmentReducer, {
  reset as departmentReset,
} from "../layouts/DepartmentTable/departmentSlice";
import deviceReducer, {
  reset as deviceReset,
} from "../layouts/DeviceTable/deviceSlice";
import employeeReducer, {
  reset as employeeReset,
} from "../layouts/EmployeeTable/employeeSlice";
import laboratoryReducer, {
  reset as laboratoryReset,
} from "../layouts/LaboratoryTable/laboratorySlice";
import lessonLabReducer, {
  reset as lessonLabReset,
} from "../layouts/LessonLabTable/lessonLabSlice";
import manufacturerReducer, {
  reset as manufacturerReset,
} from "../layouts/ManufacturerTable/manufacturerSlice";
import planSubjectReducer, {
  reset as planSubjectReset,
} from "../layouts/PlanSubjectTable/planSubjectSlice";
import purchaseOrderDeviceReduce from "../layouts/PurchaseOrderDevices/purchaseOrderDeviceSlice";
import purchaseOrderReducer, {
  reset as purchaseOrderReset,
} from "../layouts/PurchaseOrderTable/purchaseOrderSlice";
import registerGeneralReducer, {
  reset as registerGeneralReset,
} from "../layouts/RegisterGeneralTable/registerGeneralSlice";
import researchTeamReducer, {
  reset as researchTeamReset,
} from "../layouts/ResearchTeamTable/researchTeamSlice";
import scheduleReducer, {
  reset as scheduleReset,
} from "../layouts/ScheduleTable/scheduleSlice";
import subjectReducer, {
  reset as subjectReset,
} from "../layouts/SubjectTable/subjectSlice";
import suggestNewDeviceReducer, {
  reset as suggestNewDeviceReset,
} from "../layouts/SuggestNewDevicesTable/suggestNewDeviceSlice";
import supplierReducer, {
  reset as supplierReset,
} from "../layouts/SupplierTable/supplierSlice";
import trainScheduleReducer, {
  reset as trainScheduleReset,
} from "../layouts/TrainSchedule/TrainScheduleSlice";
import userManagerReducer from "../layouts/UserManager/userManagerSlice";
import warehouseReducer, {
  reset as warehouseReset,
} from "../layouts/WarehouseTable/warehouseSlice";
import appReducer, { reset as appReset } from "../pages/appSlice";

const resetStateMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (action.type === "userManager/logout") {
      dispatch(appReset());
      dispatch(laboratoryReset());
      dispatch(employeeReset());
      dispatch(departmentReset());
      dispatch(manufacturerReset());
      dispatch(chemicalReset());
      dispatch(chemicalWarehouseReset());
      dispatch(supplierReset());
      dispatch(deviceReset());
      dispatch(subjectReset());
      dispatch(classSubjectReset());
      dispatch(lessonLabReset());
      dispatch(warehouseReset());
      dispatch(registerGeneralReset());
      dispatch(purchaseOrderReset());
      dispatch(scheduleReset());
      dispatch(planSubjectReset());
      dispatch(researchTeamReset());
      dispatch(trainScheduleReset());
      dispatch(suggestNewDeviceReset());
    }
    return next(action);
  };

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
    suggestNewDevice: suggestNewDeviceReducer,
    userManager: userManagerReducer,
    purchaseOrderDevice: purchaseOrderDeviceReduce,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(resetStateMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
