import { SnackbarContent } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setListOfChemicals } from '../layouts/ChemicalTable/chemicalSlice';
import ChemicalWarehouseTable from '../layouts/ChemicalWarehouseTable';
import { setListOfChemicalWarehouse } from '../layouts/ChemicalWarehouseTable/chemicalWarehouseSlice';
import ClassSubjectTable from '../layouts/ClassSubjectTable';
import { setListOfClassSubjects } from '../layouts/ClassSubjectTable/classSubjectSlice';
import DepartmentTable from '../layouts/DepartmentTable';
import { setListOfDepartments } from '../layouts/DepartmentTable/departmentSlice';
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
import RegisterGeneralsTable from '../layouts/RegisterGeneralTable';
import { setListOfRegisterGenerals } from '../layouts/RegisterGeneralTable/registerGeneralSlice';
import ResearchTeamTable from '../layouts/ResearchTeamTable';
import { setListOfResearchTeams } from '../layouts/ResearchTeamTable/researchTeamSlice';
import FacultyViewScheduleTable from '../layouts/ScheduleTable/FacultyViewIndex';
import { setListOfSchedules } from '../layouts/ScheduleTable/scheduleSlice';
import TeacherViewScheduleTable from '../layouts/ScheduleTable/TeacherViewIndex';
import SubjectTable from '../layouts/SubjectTable';
import { setListOfSubjects } from '../layouts/SubjectTable/subjectSlice';
import SupplierTable from '../layouts/SupplierTable';
import { setListOfSuppliers } from '../layouts/SupplierTable/supplierSlice';
import TrainSchedule from '../layouts/TrainSchedule';
import {
	setListOfTrainDevice,
	setListOfTrainer,
	setListOfTrainInstructor
} from '../layouts/TrainSchedule/TrainScheduleSlice';
import WarehouseTable from '../layouts/WarehouseTable';
import { setListOfWarehouseDepartment } from '../layouts/WarehouseTable/warehouseSlice';
import { getChemicals } from '../services/chemicalServices';
import { getChemicalWarehouseById } from '../services/chemicalWarehouseServices';
import { getClassSubjects } from '../services/clasSubjectServices';
import { getDepartments } from '../services/departmentServices';
import { getDevices, getDeviceSpec } from '../services/deviceServices';
import { getEmployees } from '../services/employeeServices';
import { getExportsDep } from '../services/exportsServices';
import { getLaboratories } from '../services/laboratoryServices';
import { getLessonLabs } from '../services/lessonLabServices';
import { getManufacturers } from '../services/manufacturerServices';
import { getPlanSubjects } from '../services/planSubjectServices';
import { getPurchaseOrders } from '../services/purchaseOrderServices';
import { getRegisterGenerals } from '../services/registerGeneralServices';
import { getResearchTeams } from '../services/researchTeamServices';
import { getSchedules } from '../services/scheduleServices';
import { getSubjects } from '../services/subjectServices';
import { getSuppliers } from '../services/supplierServices';
import { getTrainDevices, getTrainer, getTrainInstructors } from '../services/trainServices';
import { RootState } from '../store';
import { IChemicalType } from '../types/chemicalType';
import { IChemicalWarehouseType } from '../types/chemicalWarehouseType';
import { IClassSubjectType } from '../types/classSubjectType';
import { IDepartmentType } from '../types/departmentType';
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
import { ITrainDevice, ITrainer, ITrainInstructor } from '../types/trainType';
import { setSnackbarMessage } from './appSlice';
import './Dashboard.css';

import { loadMessages } from 'devextreme/localization';
import viMessages from '../configs/devextreme_vi.json';
import SuggestNewDevicesTable from '../layouts/SuggestNewDevicesTable';
import { setListOfSuggestNewDevices } from '../layouts/SuggestNewDevicesTable/suggestNewDeviceSlice';
import { getSuggestNewDevices } from '../services/suggestNewDeviceServices';
import { IResearchTeamType } from '../types/researchTeamType';
import { ISuggestNewDeviceType } from '../types/suggestNewDeviceType';
import { useNavigate } from 'react-router-dom';
import { getFromLocalStorage } from '../configs/apiHelper';
import DeviceTable from '../layouts/DeviceTable';

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

	useEffect(() => {
		loadMessages(viMessages);
	}, []);

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
		const listOfRegisterGeneral: IRegisterGeneralType[] = await getRegisterGenerals('2');
		if (listOfRegisterGeneral) {
			dispatch(setListOfRegisterGenerals(listOfRegisterGeneral));
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

	const getResearchTeamsData = async () => {
		const listOfResearchTeams: IResearchTeamType[] = await getResearchTeams();
		if (listOfResearchTeams) {
			dispatch(setListOfResearchTeams(listOfResearchTeams));
		}
	};

	const getTrainDeviceData = async () => {
		const listOfTrainDevices: ITrainDevice[] = await getTrainDevices();
		if (listOfTrainDevices) {
			dispatch(setListOfTrainDevice(listOfTrainDevices));
		}
	};

	const getTrainInstructorData = async () => {
		const listOfTrainInstructors: ITrainInstructor[] = await getTrainInstructors();
		if (listOfTrainInstructors) {
			dispatch(setListOfTrainInstructor(listOfTrainInstructors));
		}
	};

	const getTrainerData = async () => {
		const listOfTrainer: ITrainer[] = await getTrainer();
		if (listOfTrainer) {
			dispatch(setListOfTrainer(listOfTrainer));
		}
	};

	const getSuggestNewDevicesData = async () => {
		const listOfSuggestNewDevices: ISuggestNewDeviceType[] = await getSuggestNewDevices('2');
		if (listOfSuggestNewDevices) {
			dispatch(setListOfSuggestNewDevices(listOfSuggestNewDevices));
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
		getResearchTeamsData();
		getTrainDeviceData();
		getTrainInstructorData();
		getTrainerData();
		getSuggestNewDevicesData();
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
				{sidebarItems[0].isOpen && <LaboratoryTable />}
				{sidebarItems[1].isOpen && <DepartmentTable />}
				{sidebarItems[2].isOpen && <EmployeeTable />}
				{sidebarItems[3].isOpen && <ResearchTeamTable />}
				{sidebarItems[4].isOpen && <ChemicalWarehouseTable role={role} />}
				{sidebarItems[5].isOpen && <DeviceTable />}
				{sidebarItems[6].isOpen && <ManufacturersTable />}
				{sidebarItems[7].isOpen && <SupplierTable />}
				{sidebarItems[8].isOpen && (role === 1 ? <FacultyViewScheduleTable /> : <TeacherViewScheduleTable />)}
				{sidebarItems[9].isOpen && <SubjectTable />}
				{sidebarItems[10].isOpen && <ClassSubjectTable />}
				{sidebarItems[11].isOpen && <LessonLabTable />}
				{sidebarItems[12].isOpen && <WarehouseTable />}
				{sidebarItems[13].isOpen && <PurchaseOrderTable />}
				{sidebarItems[14].isOpen && <PlanSubjectTable />}
				{sidebarItems[15].isOpen && <RegisterGeneralsTable />}
				{sidebarItems[16].isOpen && <SuggestNewDevicesTable />}
				{sidebarItems[17].isOpen && <DeviceTransfer />}
				{sidebarItems[18].isOpen && <TrainSchedule />}
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
				<SnackbarContent
					style={{
						backgroundColor: snackbarState.backgroundColor,
						color: snackbarState.color,
					}}
					message={snackbarState.message}
				/>
			</Snackbar>
		</>
	);
}
