import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
    Scheduler,
    WeekView,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import appointments from './today-appointments';

export default () => (
    <>
        <h3 style={{ "margin": "0px", "textAlign": "left", "padding": "8px" }}>
            <b><KeyboardArrowRightIcon
                style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
            ></KeyboardArrowRightIcon></b>
            <span>Thông tin thời khoá biểu</span>
        </h3>
        <Paper>
            <Scheduler data={appointments} height={500}>
                <WeekView startDayHour={7} endDayHour={21} />
                <Appointments />
            </Scheduler>
        </Paper>
    </>
);
