import Snackbar from '@mui/material/Snackbar';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import ChemicalTable from '../layouts/ChemicalTable';
import { setListOfChemicals } from '../layouts/ChemicalTable/chemicalSlice';
import ClassSubjectTable from '../layouts/ClassSubjectTable';
import { setListOfClassSubjects } from '../layouts/ClassSubjectTable/classSubjectSlice';
import DepartmentTable from '../layouts/DepartmentTable';
import { setListOfDepartments } from '../layouts/DepartmentTable/departmentSlice';
import DeviceTable from '../layouts/DeviceTable';
import { setListOfDevices, setListOfDeviceSpecs } from '../layouts/DeviceTable/deviceSlice';
import EmployeeTable from '../layouts/EmployeeTable';
import { setListOfEmployees } from '../layouts/EmployeeTable/employeeSlice';
import ExportChemicalTable from '../layouts/ExportChemicalTable';
import { setListOfExportChemical } from '../layouts/ExportChemicalTable/exportChemicalSlice';
import ExportDeviceTable from '../layouts/ExportDeviceTable';
import { setListOfExportDevice } from '../layouts/ExportDeviceTable/exportDeviceSlice';
import LaboratoryTable from '../layouts/LaboratoryTable';
import { setListOfLaboratories } from '../layouts/LaboratoryTable/laboratorySlice';
import LessonLabTable from '../layouts/LessonLabTable';
import { setListOfLessonLabs } from '../layouts/LessonLabTable/lessonLabSlice';
import ManufacturersTable from '../layouts/ManufacturerTable';
import { setListOfManufacturers } from '../layouts/ManufacturerTable/manufacturerSlice';
import { setListOfOrderDevices } from '../layouts/DeviceTable/orderDeviceSlice';
import { PurchaseOrderTable } from '../layouts/PurchaseOrderTable';
import { setListOfOrderChemicals } from '../layouts/ChemicalTable/orderChemicalSlice';
import { setListOfPurchaseOrders } from '../layouts/PurchaseOrderTable/purchaseOrderSlice';
import { setListOfRegisterGeneral } from '../layouts/RegisterGeneralTable/registerGeneralSlice';
import ScheduleTable from '../layouts/ScheduleTable';
import { setListOfSchedules } from '../layouts/ScheduleTable/scheduleSlice';
import SubjectTable from '../layouts/SubjectTable';
import { setListOfSubjects } from '../layouts/SubjectTable/subjectSlice';
import SupplierTable from '../layouts/SupplierTable';
import { setListOfSuppliers } from '../layouts/SupplierTable/supplierSlice';
import WarehouseTable from '../layouts/WarehouseTable';
import { setListOfWarehouseLaboratory, setListOfWarehouseRegisterGeneral, setListOfWarehouseStudySession } from '../layouts/WarehouseTable/warehouseSlice';
import { getChemicals } from '../services/chemicalServices';
import { getClassSubjects } from '../services/clasSubjectServices';
import { getDepartments } from '../services/departmentServices';
import { getDevices, getDeviceSpec } from '../services/deviceServices';
import { getEmployees } from '../services/employeeServices';
import { getExportChemical } from '../services/exportChemicalServices';
import { getExportDevice } from '../services/exportDeviceServices';
import { getLaboratories } from '../services/laboratoryServices';
import { getLessonLabs } from '../services/lessonLabServices';
import { getManufacturers } from '../services/manufacturerServices';
import { getOrderChemicals } from '../services/orderChemicalServices';
import { getOrderDevices } from '../services/orderDeviceServices';
import { getPurchaseOrders } from '../services/purchaseOrderServices';
import { getRegisterGeneral } from '../services/registerGeneralServices';
import { getSchedules } from '../services/scheduleServices';
import { getSubjects } from '../services/subjectServices';
import { getSuppliers } from '../services/supplierServices';
import { getWarehouseFeildId } from '../services/warehouseServices';
import { RootState } from '../store';
import { IChemicalType } from '../types/chemicalType';
import { IClassSubjectType } from '../types/classSubjectType';
import { IDepartmentType } from '../types/departmentType';
import { IDeviceSpecType, IDeviceType } from '../types/deviceType';
import { IEmployeeType } from '../types/employeeType';
import { IExportChemicalType } from '../types/exportChemicalType';
import { IExportDeviceType } from '../types/exportDeviceType';
import { ILaboratoryType } from '../types/laboratoryType';
import { ILessonLabType } from '../types/lessonLabType';
import { IManufacturerType } from '../types/manufacturerType';
import { IOrderChemicalType } from '../types/orderChemicalType';
import { IOrderDeviceType } from '../types/orderDeviceType';
import { IPurchaseOrderType } from '../types/purchaseOrderType';
import { IRegisterGeneralType } from '../types/registerGeneralType';
import { IScheduleType } from '../types/scheduleType';
import { ISubjectType } from '../types/subjectType';
import { ISupplierType } from '../types/supplierType';
import { IWarehouseType } from '../types/warehouseType';
import { setSnackbarMessage } from './appSlice';
import './Dashboard.css';

export function Dashboard() {
    const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
    const deviceSpecData = useAppSelector((state: RootState) => state.device.listOfDeviceSpecs);
    const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
    const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);
    const manufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);
    const chemicalData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
    const supplierData = useAppSelector((state: RootState) => state.supplier.listOfSuppliers);
    const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
    const subjectData = useAppSelector((state: RootState) => state.subject.listOfSubjects);
    const classSubjectData = useAppSelector((state: RootState) => state.classSubject.listOfClassSubjects);
    const lessonLabData = useAppSelector((state: RootState) => state.lessonLab.listOfLessonLabs);
    const snackbarState = useAppSelector((state: RootState) => state.app.snackbarState);
    const sidebarItems = useAppSelector((state: RootState) => state.app.sidebarItems);

    const dispatch = useAppDispatch();

    const getLaboratoryData = async () => {
        const listOfLaboratories: ILaboratoryType[] = await getLaboratories();
        if (listOfLaboratories) {
            dispatch(setListOfLaboratories(listOfLaboratories));
        }
    }

    const getDeviceSpecData = async () => {
        const listOfDeviceSpec: IDeviceSpecType[] = await getDeviceSpec();
        if (listOfDeviceSpec) {
            dispatch(setListOfDeviceSpecs(listOfDeviceSpec));
        }
    }

    const getEmployeeData = async () => {
        const listOfEmployees: IEmployeeType[] = await getEmployees();
        if (listOfEmployees) {
            dispatch(setListOfEmployees(listOfEmployees));
        }
    }

    const getDepartmentData = async () => {
        const listOfDepartment: IDepartmentType[] = await getDepartments();
        if (listOfDepartment) {
            dispatch(setListOfDepartments(listOfDepartment));
        }
    }

    const getManufacturerData = async () => {
        const listOfManufacturers: IManufacturerType[] = await getManufacturers();
        if (listOfManufacturers) {
            dispatch(setListOfManufacturers(listOfManufacturers));
        }
    }

    const getSupplierData = async () => {
        const listOfSupplier: ISupplierType[] = await getSuppliers();
        if (listOfSupplier) {
            dispatch(setListOfSuppliers(listOfSupplier));
        }
    }

    const getChemicalData = async () => {
        const listOfChemical: IChemicalType[] = await getChemicals();
        if (listOfChemical) {
            dispatch(setListOfChemicals(listOfChemical));
        }
    }

    const getDeviceData = async () => {
        const listOfDevices: IDeviceType[] = await getDevices();
        if (listOfDevices) {
            dispatch(setListOfDevices(listOfDevices));
        }
    }

    const getSubjectData = async () => {
        const listOfSubjects: ISubjectType[] = await getSubjects();
        if (listOfSubjects) {
            dispatch(setListOfSubjects(listOfSubjects));
        }
    }

    const getClassSubjectData = async () => {
        const listOfClassSubjects: IClassSubjectType[] = await getClassSubjects();
        if (listOfClassSubjects) {
            dispatch(setListOfClassSubjects(listOfClassSubjects));
        }
    }

    const getLessonLabData = async () => {
        const listOfLessonLabs: ILessonLabType[] = await getLessonLabs();
        if (listOfLessonLabs) {
            dispatch(setListOfLessonLabs(listOfLessonLabs));
        }
    }

    const getWarehouseLaboratoryData = async () => {
        const listOfWarehouseLaboratorys: IWarehouseType[] = await getWarehouseFeildId('lab');
        if (listOfWarehouseLaboratorys) {
            dispatch(setListOfWarehouseLaboratory(listOfWarehouseLaboratorys));
        }
    }

    const getWarehouseRegisterGeneralData = async () => {
        const listOfWarehouseRegisterGeneral: IWarehouseType[] = await getWarehouseFeildId('reg');
        if (listOfWarehouseRegisterGeneral) {
            dispatch(setListOfWarehouseRegisterGeneral(listOfWarehouseRegisterGeneral));
        }
    }

    const getWarehouseStudySessionData = async () => {
        const listOfWarehouseStudySession: IWarehouseType[] = await getWarehouseFeildId('ses');
        if (listOfWarehouseStudySession) {
            dispatch(setListOfWarehouseStudySession(listOfWarehouseStudySession));
        }
    }

    const getRegisterGeneralsData = async () => {
        const listOfRegisterGeneral: IRegisterGeneralType[] = await getRegisterGeneral();
        if (listOfRegisterGeneral) {
            dispatch(setListOfRegisterGeneral(listOfRegisterGeneral));
        }
    }

    const getExportChemicalData = async () => {
        const listOfExportChemical: IExportChemicalType[] = await getExportChemical();
        if (listOfExportChemical) {
            dispatch(setListOfExportChemical(listOfExportChemical));
        }
    }
    const getExportDeviceData = async () => {
        const listOfExportDevice: IExportDeviceType[] = await getExportDevice();
        if (listOfExportDevice) {
            dispatch(setListOfExportDevice(listOfExportDevice));
        }
    }

    const getPurchaseOrderData = async () => {
        const listOfPurchaseOrders: IPurchaseOrderType[] = await getPurchaseOrders();
        if (listOfPurchaseOrders) {
            dispatch(setListOfPurchaseOrders(listOfPurchaseOrders));
        }
    }

    const getOrderChemicalData = async () => {
        const listOfOrderChemicals: IOrderChemicalType[] = await getOrderChemicals();
        if (listOfOrderChemicals) {
            dispatch(setListOfOrderChemicals(listOfOrderChemicals));
        }
    }

    const getOrderDeviceData = async () => {
        const listOfOrderDevices: IOrderDeviceType[] = await getOrderDevices();
        if (listOfOrderDevices) {
            dispatch(setListOfOrderDevices(listOfOrderDevices));

    const getScheduleData = async () => {
        const listOfSchedules: IScheduleType[] = await getSchedules();
        if (listOfSchedules) {
            dispatch(setListOfSchedules(listOfSchedules));
        }
    }

    useEffect(() => {
        getLaboratoryData();
        getEmployeeData();
        getDepartmentData();
        getManufacturerData();
        getSupplierData();
        getChemicalData();
        getDeviceData();
        getDeviceSpecData();
        getSubjectData();
        getClassSubjectData();
        getLessonLabData();
        getWarehouseRegisterGeneralData();
        getWarehouseLaboratoryData();
        getRegisterGeneralsData();
        getExportChemicalData();
        getWarehouseStudySessionData();
        getExportDeviceData();
        getPurchaseOrderData();
        getOrderChemicalData();
        getOrderDeviceData();
        getScheduleData();
    }, [])

    const snackbarFunc = () => setTimeout(() => {
        dispatch((setSnackbarMessage("")));
    }, 1000)

    useEffect(() => {
        if (snackbarState.isOpen) {
            snackbarFunc();
        }
        return () => {
            clearTimeout(snackbarFunc());
        }
    }, [snackbarState.isOpen])

    return (
        <>
            <div className="home">
                {/* <InstrumentTable/> */}
                {sidebarItems[0].isOpen && laboratoriesData?.length > 0 && <LaboratoryTable />}
                {sidebarItems[1].isOpen && departmentData?.length > 0 && <DepartmentTable />}
                {sidebarItems[2].isOpen && employeeData?.length > 0 && <EmployeeTable />}
                {sidebarItems[3].isOpen && manufacturersData?.length > 0 && <ManufacturersTable />}
                {sidebarItems[4].isOpen && chemicalData?.length > 0 && <ChemicalTable type="normal" />}
                {sidebarItems[5].isOpen && supplierData?.length > 0 && <SupplierTable />}
                {sidebarItems[6].isOpen && deviceData?.length > 0 && deviceSpecData.length > 0 && manufacturersData?.length > 0 && <DeviceTable type="normal" />}
                {sidebarItems[7].isOpen && <SchedulerTable />}
                {sidebarItems[8].isOpen && subjectData?.length > 0 && <SubjectTable />}
                {sidebarItems[9].isOpen && classSubjectData?.length > 0 && <ClassSubjectTable />}
                {sidebarItems[10].isOpen && lessonLabData?.length > 0 && <LessonLabTable />}
                {sidebarItems[11].isOpen && <WarehouseTable />}
                {sidebarItems[12].isOpen && <ExportChemicalTable />}
                {sidebarItems[13].isOpen && <ExportDeviceTable />}
                {sidebarItems[14].isOpen && <PurchaseOrderTable />}
                {sidebarItems[15].isOpen && <ChemicalTable type="generalOrder" />}
                {sidebarItems[16].isOpen && <DeviceTable type="generalOrder" />}
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={snackbarState.isOpen}
                // onClose={handleClose}
                message={snackbarState.message}
                key='bottomRight'
            />
        </>
    )
}