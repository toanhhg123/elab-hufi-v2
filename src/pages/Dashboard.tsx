import React from 'react'
import {Counter} from "../layouts/Counter";
import InstrumentTable from '../layouts/Counter/InstrumentTable';
import DepartmentTable from '../layouts/DepartmentTable';
import DeviceSpecTable from '../layouts/DeviceSpecTable';
import EmployeeTable from '../layouts/EmployeeTable';
import LaboratoriesTable from '../layouts/LaboratoriesTable';
import ManufacturersTable from '../layouts/ManufacturerTable';
import './Dashboard.css';

export function Dashboard() {
    return (
        <div className="home">  
        {/* <InstrumentTable/> */}
        {/* <LaboratoriesTable /> */}
        {/* <DeviceSpecTable /> */}
        {/* <EmployeeTable /> */}
        {/* <DepartmentTable /> */}
        <ManufacturersTable />
        </div>
    )
}