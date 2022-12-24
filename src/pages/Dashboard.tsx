import Snackbar from '@mui/material/Snackbar';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import ChemicalTable from '../layouts/ChemicalTable';
import { setListOfChemicals } from '../layouts/ChemicalTable/chemicalSlice';
import ChemicalWarehouseTable from '../layouts/ChemicalWarehouseTable';
import { setListOfChemicalWarehouse } from '../layouts/ChemicalWarehouseTable/chemicalWarehouseSlice';
import ClassSubjectTable from '../layouts/ClassSubjectTable';
import { setListOfClassSubjects } from '../layouts/ClassSubjectTable/classSubjectSlice';
import DepartmentTable from '../layouts/DepartmentTable';
import { setListOfDepartments } from '../layouts/DepartmentTable/departmentSlice';
import DeviceTable from '../layouts/DeviceTable';
import { setListOfDevices, setListOfDeviceSpecs } from '../layouts/DeviceTable/deviceSlice';
import DeviceTransfer from '../layouts/DeviceTransfer';
import EmployeeTable from '../layouts/EmployeeTable';
import { setListOfEmployees } from '../layouts/EmployeeTable/employeeSlice';
import LaboratoryTable from '../layouts/LaboratoryTable';
import { setListOfLaboratories } from '../layouts/LaboratoryTable/laboratorySlice';
import LessonLabTable from '../layouts/LessonLabTable';
import { setListOfLessonLabs } from '../layouts/LessonLabTable/lessonLabSlice';
import ManufacturersTable from '../layouts/ManufacturerTable';
import { setListOfManufacturers } from '../layouts/ManufacturerTable/manufacturerSlice';
import PlanSubjectTable from '../layouts/PlanSubjectTable';
import { setListOfPlanSubjects } from '../layouts/PlanSubjectTable/planSubjectSlice';
import { PurchaseOrderTable } from '../layouts/PurchaseOrderTable';
import { setListOfPurchaseOrders } from '../layouts/PurchaseOrderTable/purchaseOrderSlice';
import { setListOfRegisterGeneral } from '../layouts/RegisterGeneralTable/registerGeneralSlice';
import { setListOfSchedules } from '../layouts/ScheduleTable/scheduleSlice';
import TeacherViewScheduleTable from '../layouts/ScheduleTable/TeacherViewIndex';
import FacultyViewScheduleTable from '../layouts/ScheduleTable/FacultyViewIndex';
import SubjectTable from '../layouts/SubjectTable';
import { setListOfSubjects } from '../layouts/SubjectTable/subjectSlice';
import SupplierTable from '../layouts/SupplierTable';
import { setListOfSuppliers } from '../layouts/SupplierTable/supplierSlice';
import WarehouseTable from '../layouts/WarehouseTable';
import {
	setListOfWarehouseDepartment,
	setListOfWarehouseLaboratory,
	setListOfWarehouseRegisterGeneral,
	setListOfWarehouseStudySession,
} from '../layouts/WarehouseTable/warehouseSlice';
import { getChemicals } from '../services/chemicalServices';
import { getChemicalWarehouseById } from '../services/chemicalWarehouseServices';
import { getClassSubjects } from '../services/clasSubjectServices';
import { getDepartments } from '../services/departmentServices';
import { getDevices, getDeviceSpec } from '../services/deviceServices';
import { getDevicesTransfer } from '../services/deviceTransfer';
import { getEmployees } from '../services/employeeServices';
import { getExportsDep, getExportsLabs, getExportsRegs, getExportsSubs } from '../services/exportsServices';
import { getLaboratories } from '../services/laboratoryServices';
import { getLessonLabs } from '../services/lessonLabServices';
import { getManufacturers } from '../services/manufacturerServices';
import { getPlanSubjects } from '../services/planSubjectServices';
import { getPurchaseOrders } from '../services/purchaseOrderServices';
import { getRegisterGeneral } from '../services/registerGeneralServices';
import { getSchedules } from '../services/scheduleServices';
import { getSubjects } from '../services/subjectServices';
import { getSuppliers } from '../services/supplierServices';
import { RootState } from '../store';
import { IChemicalType } from '../types/chemicalType';
import { IChemicalWarehouseType } from '../types/chemicalWarehouseType';
import { IClassSubjectType } from '../types/classSubjectType';
import { IDepartmentType } from '../types/departmentType';
import { IDeviceTransfer } from '../types/deviceTransferType';
import { IDeviceSpecType, IDeviceType } from '../types/deviceType';
import { IEmployeeType } from '../types/employeeType';
import { IExportType } from '../types/exportType';
import { ILaboratoryType } from '../types/laboratoryType';
import { ILessonLabType } from '../types/lessonLabType';
import { IManufacturerType } from '../types/manufacturerType';
import { IPlanSubjectType } from '../types/planSubjectType';
import { IPurchaseOrderType } from '../types/purchaseOrderType';
import { IRegisterGeneralType } from '../types/registerGeneralType';
import { IScheduleType } from '../types/scheduleType';
import { ISubjectType } from '../types/subjectType';
import { ISupplierType } from '../types/supplierType';
import { setSnackbarMessage } from './appSlice';
import './Dashboard.css';
import { SnackbarContent } from '@mui/material';

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

	const role = Number(localStorage.getItem('role') || 1);

	const dispatch = useAppDispatch();

	const getLaboratoryData = async () => {
		const listOfLaboratories: ILaboratoryType[] = await getLaboratories();
		if (listOfLaboratories) {
			dispatch(setListOfLaboratories(listOfLaboratories));
		}
	};

	const getDeviceSpecData = async () => {
		const listOfDeviceSpec: IDeviceSpecType[] = await getDeviceSpec();
		if (listOfDeviceSpec) {
			dispatch(setListOfDeviceSpecs(listOfDeviceSpec));
		}
	};

	const getEmployeeData = async () => {
		const listOfEmployees: IEmployeeType[] = await getEmployees();
		if (listOfEmployees) {
			dispatch(setListOfEmployees(listOfEmployees));
		}
	};

	const getDepartmentData = async () => {
		const listOfDepartment: IDepartmentType[] = await getDepartments();
		if (listOfDepartment) {
			dispatch(setListOfDepartments(listOfDepartment));
		}
	};

	const getManufacturerData = async () => {
		const listOfManufacturers: IManufacturerType[] = await getManufacturers();
		if (listOfManufacturers) {
			dispatch(setListOfManufacturers(listOfManufacturers));
		}
	};

	const getSupplierData = async () => {
		const listOfSupplier: ISupplierType[] = await getSuppliers();
		if (listOfSupplier) {
			dispatch(setListOfSuppliers(listOfSupplier));
		}
	};

	const getChemicalData = async () => {
		const listOfChemical: IChemicalType[] = await getChemicals();
		if (listOfChemical) {
			dispatch(setListOfChemicals(listOfChemical));
		}
	};

	const getChemicalWarehouseData = async () => {
		const listOfChemicalWarehouse: IChemicalWarehouseType[] = await getChemicalWarehouseById(role);
		if (listOfChemicalWarehouse) {
			dispatch(setListOfChemicalWarehouse(listOfChemicalWarehouse));
		}
	};

	const getDeviceData = async () => {
		const listOfDevices: IDeviceType[] = await getDevices();
		if (listOfDevices) {
			dispatch(setListOfDevices(listOfDevices));
		}
	};

	const getSubjectData = async () => {
		const listOfSubjects: ISubjectType[] = await getSubjects();
		if (listOfSubjects) {
			dispatch(setListOfSubjects(listOfSubjects));
		}
	};

	const getClassSubjectData = async () => {
		const listOfClassSubjects: IClassSubjectType[] = await getClassSubjects();
		if (listOfClassSubjects) {
			dispatch(setListOfClassSubjects(listOfClassSubjects));
		}
	};

	const getLessonLabData = async () => {
		const listOfLessonLabs: ILessonLabType[] = await getLessonLabs();
		if (listOfLessonLabs) {
			dispatch(setListOfLessonLabs(listOfLessonLabs));
		}
	};

	const getWarehouseDepartmentData = async () => {
		const listOfExportDepartment: IExportType[] = await getExportsDep();
		if (listOfExportDepartment) {
			dispatch(setListOfWarehouseDepartment(listOfExportDepartment));
		}
	};

	const getRegisterGeneralsData = async () => {
		const listOfRegisterGeneral: IRegisterGeneralType[] = await getRegisterGeneral();
		if (listOfRegisterGeneral) {
			dispatch(setListOfRegisterGeneral(listOfRegisterGeneral));
		}
	};

	const getPurchaseOrderData = async () => {
		const listOfPurchaseOrders: IPurchaseOrderType[] = await getPurchaseOrders();
		if (listOfPurchaseOrders) {
			dispatch(setListOfPurchaseOrders(listOfPurchaseOrders));
		}
	};

	const getScheduleData = async () => {
		const listOfSchedules: IScheduleType[] = await getSchedules();
		if (listOfSchedules) {
			dispatch(setListOfSchedules(listOfSchedules));
		}
	};

	const getPlanSubjectData = async () => {
		const listOfPlanSubjects: IPlanSubjectType[] = await getPlanSubjects();
		if (listOfPlanSubjects) {
			dispatch(setListOfPlanSubjects(listOfPlanSubjects));
		}
	};

	useEffect(() => {
		getLaboratoryData();
		getEmployeeData();
		getDepartmentData();
		getManufacturerData();
		getSupplierData();
		getChemicalData();
		getChemicalWarehouseData();
		getDeviceData();
		getDeviceSpecData();
		getSubjectData();
		getClassSubjectData();
		getLessonLabData();
		getRegisterGeneralsData();
		getWarehouseDepartmentData();
		getPurchaseOrderData();
		getScheduleData();
		getPlanSubjectData();
	}, []);

	const snackbarFunc = () =>
		setTimeout(() => {
			dispatch(setSnackbarMessage(''));
		}, 1000);

	useEffect(() => {
		if (snackbarState.isOpen) {
			snackbarFunc();
		}
		return () => {
			clearTimeout(snackbarFunc());
		};
	}, [snackbarState.isOpen]);

	return (
		<>
			<div className="home">
				{/* <InstrumentTable/> */}
				{sidebarItems[0].isOpen && laboratoriesData?.length > 0 && <LaboratoryTable />}
				{sidebarItems[1].isOpen && departmentData?.length > 0 && <DepartmentTable />}
				{sidebarItems[2].isOpen && employeeData?.length > 0 && <EmployeeTable />}
				{sidebarItems[3].isOpen && <ChemicalWarehouseTable role={role} />}
				{/* {sidebarItems[4].isOpen && chemicalData?.length > 0 && <ChemicalTable />} */}
				{/* {sidebarItems[5].isOpen && deviceData?.length > 0 && deviceSpecData.length > 0 && manufacturersData?.length > 0 && <DeviceTable />} */}
				{sidebarItems[4].isOpen && manufacturersData?.length > 0 && <ManufacturersTable />}
				{sidebarItems[5].isOpen && supplierData?.length > 0 && <SupplierTable />}
				{sidebarItems[6].isOpen && (role === 1 ? <FacultyViewScheduleTable /> : <TeacherViewScheduleTable />)}
				{sidebarItems[7].isOpen && subjectData?.length > 0 && <SubjectTable />}
				{sidebarItems[8].isOpen && classSubjectData?.length > 0 && <ClassSubjectTable />}
				{sidebarItems[9].isOpen && lessonLabData?.length > 0 && <LessonLabTable />}
				{sidebarItems[10].isOpen && <WarehouseTable />}
				{sidebarItems[11].isOpen && <PurchaseOrderTable />}
				{sidebarItems[12].isOpen && <PlanSubjectTable />}
				{sidebarItems[13].isOpen && <DeviceTransfer />}
			</div>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				open={snackbarState.isOpen}
				message={snackbarState.message}
				key="bottomRight"
			>
				<SnackbarContent style={{
					backgroundColor: snackbarState.backgroundColor,
					color: snackbarState.color
				}}
					message={snackbarState.message}
				/>
			</Snackbar>
		</>
	);
}
