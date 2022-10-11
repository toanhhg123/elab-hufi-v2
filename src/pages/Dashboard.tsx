import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks';
import ChemicalTable from '../layouts/ChemicalTable';
import { setListOfChemicals } from '../layouts/ChemicalTable/chemicalSlice';
import ClassSubjectTable from '../layouts/ClassSubjectTable';
import { setListOfClassSubjects } from '../layouts/ClassSubjectTable/classSubjectSlice';
import { Counter } from "../layouts/Counter";
import InstrumentTable from '../layouts/Counter/InstrumentTable';
import DepartmentTable from '../layouts/DepartmentTable';
import { setListOfDepartments } from '../layouts/DepartmentTable/departmentSlice';
import DeviceSpecTable from '../layouts/DeviceSpecTable';
import { setListOfDeviceSpecs } from '../layouts/DeviceSpecTable/deviceSpecSlice';
import DeviceTable from '../layouts/DeviceTable';
import { setListOfDevices } from '../layouts/DeviceTable/deviceSlice';
import EmployeeTable from '../layouts/EmployeeTable';
import { setListOfEmployees } from '../layouts/EmployeeTable/employeeSlice';
import LaboratoryTable from '../layouts/LaboratoryTable';
import { setListOfLaboratories } from '../layouts/LaboratoryTable/laboratorySlice';
import ManufacturersTable from '../layouts/ManufacturerTable';
import { setListOfManufacturers } from '../layouts/ManufacturerTable/manufacturerSlice';
import SubjectTable from '../layouts/SubjectTable';
import { setListOfSubjects } from '../layouts/SubjectTable/subjectSlice';
import SupplierTable from '../layouts/SupplierTable';
import { setListOfSuppliers } from '../layouts/SupplierTable/supplierSlice';
import { getChemicals } from '../services/chemicalServices';
import { getClassSubjects } from '../services/clasSubjectServices';
import { getDepartments } from '../services/departmentServices';
import { getDevices } from '../services/deviceServices';
import { getDeviceSpec } from '../services/deviceSpecServices';
import { getEmployees } from '../services/employeeServices';
import { getLaboratories } from '../services/laboratoryServices';
import { getManufacturers } from '../services/manufacturerServices';
import { getSubjects } from '../services/subjectServices';
import { getSuppliers } from '../services/supplierServices';
import { RootState } from '../store';
import { IChemicalType } from '../types/chemicalType';
import { IClassSubjectType } from '../types/classSubjectType';
import { IDepartmentType } from '../types/departmentType';
import { IDeviceSpecType } from '../types/deviceSpecType';
import { IDeviceType } from '../types/deviceType';
import { IEmployeeType } from '../types/employeeType';
import { ILaboratoryType } from '../types/laboratoryType';
import { IManufacturerType } from '../types/manufacturerType';
import { ISubjectType } from '../types/subjectType';
import { ISupplierType } from '../types/supplierType';
import './Dashboard.css';

export function Dashboard() {
    const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
    const deviceSpecData = useAppSelector((state: RootState) => state.deviceSpecs.listOfDeviceSpecs);
    const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
    const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);
    const manufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);
    const chemicalData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
    const supplierData = useAppSelector((state: RootState) => state.supplier.listOfSuppliers);
    const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
    const subjectData = useAppSelector((state: RootState) => state.subject.listOfSubjects);
    const classSubjectData = useAppSelector((state: RootState) => state.classSubject.listOfClassSubjects);

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
    }, [])

    return (
        <div className="home">
            {/* <InstrumentTable/> */}
            {sidebarItems[0].isOpen && laboratoriesData?.length > 0 && <LaboratoryTable />}
            {sidebarItems[1].isOpen && departmentData?.length > 0 && <DepartmentTable />}
            {sidebarItems[2].isOpen && employeeData?.length > 0 && <EmployeeTable />}
            {sidebarItems[3].isOpen && manufacturersData?.length > 0 && <ManufacturersTable />}
            {sidebarItems[4].isOpen && chemicalData?.length > 0 && <ChemicalTable />}
            {sidebarItems[5].isOpen && supplierData?.length > 0 && <SupplierTable />}
            {sidebarItems[6].isOpen && deviceData?.length > 0 && manufacturersData?.length > 0 && <DeviceTable />}
            {sidebarItems[7].isOpen && deviceSpecData?.length > 0 && <DeviceSpecTable />}
            {sidebarItems[8].isOpen && subjectData?.length > 0 && <SubjectTable />}
            {sidebarItems[9].isOpen && classSubjectData?.length > 0 && <ClassSubjectTable />}
        </div>
    )
}