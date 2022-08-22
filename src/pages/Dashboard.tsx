import React from 'react'
import {Counter} from "../layouts/Counter";
import InstrumentTable from '../layouts/Counter/InstrumentTable';
import './Dashboard.css'

export function Dashboard() {
    return (
        <div className="home">  
        <InstrumentTable/>
        </div>
    )
}