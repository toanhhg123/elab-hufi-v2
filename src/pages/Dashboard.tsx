import React from 'react'
import ChemicalTable from '../layouts/ChemicalTable';
import {Counter} from "../layouts/Counter";
import InstrumentTable from '../layouts/Counter/InstrumentTable';
import DepartmentTable from '../layouts/DepartmentTable';
import DeviceSpecTable from '../layouts/DeviceSpecTable';
import EmployeeTable from '../layouts/EmployeeTable';
import LaboratoryTable from '../layouts/LaboratoryTable';
import ManufacturersTable from '../layouts/ManufacturerTable';
import SupplierTable from '../layouts/SupplierTable';
import './Dashboard.css';

export function Dashboard() {
    return (
        <div className="home">  
        {/* <InstrumentTable/> */}
        {/* <LaboratoryTable /> */}
        {/* <DeviceSpecTable /> */}
        {/* <EmployeeTable /> */}
        {/* <DepartmentTable /> */}
        {/* <ManufacturersTable /> */}
        {/* <ChemicalTable /> */}
        <SupplierTable />
        </div>
    )
}