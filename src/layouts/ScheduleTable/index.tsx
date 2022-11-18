import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { styled, darken, alpha, lighten } from "@mui/material/styles";
import Paper from '@mui/material/Paper';
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import ColorLens from "@mui/icons-material/ColorLens";
import { ViewState, EditingState, GroupingState } from "@devexpress/dx-react-scheduler";
import classNames from "clsx";
import {
    Scheduler,
    WeekView,
    MonthView,
    DayView,
    Appointments,
    Toolbar,
    DateNavigator,
    EditRecurrenceMenu,
    AppointmentTooltip,
    AppointmentForm,
    DragDropProvider,
    ViewSwitcher,
    GroupingPanel,
    Resources
} from '@devexpress/dx-react-scheduler-material-ui';
import { IntegratedGrouping } from '@devexpress/dx-react-scheduler';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import { IScheduleType } from '../../types/scheduleType';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Tooltip } from '@mui/material';
import { Stack } from '@mui/system';
import { convertPeriodToHourAndMin, convertPeriodToTimestamp } from './utils';

const PREFIX = "Demo";

const classes = {
    cell: `${PREFIX}-cell`,
    content: `${PREFIX}-content`,
    text: `${PREFIX}-text`,
    sun: `${PREFIX}-sun`,
    cloud: `${PREFIX}-cloud`,
    rain: `${PREFIX}-rain`,
    sunBack: `${PREFIX}-sunBack`,
    cloudBack: `${PREFIX}-cloudBack`,
    rainBack: `${PREFIX}-rainBack`,
    opacity: `${PREFIX}-opacity`,
    appointment: `${PREFIX}-appointment`,
    apptContent: `${PREFIX}-apptContent`,
    flexibleSpace: `${PREFIX}-flexibleSpace`,
    flexContainer: `${PREFIX}-flexContainer`,
    tooltipContent: `${PREFIX}-tooltipContent`,
    tooltipText: `${PREFIX}-tooltipText`,
    title: `${PREFIX}-title`,
    icon: `${PREFIX}-icon`,
    circle: `${PREFIX}-circle`,
    textCenter: `${PREFIX}-textCenter`,
    dateAndTitle: `${PREFIX}-dateAndTitle`,
    titleContainer: `${PREFIX}-titleContainer`,
    container: `${PREFIX}-container`,
    todayCell: `${PREFIX}-todayCell`,
    weekendCell: `${PREFIX}-weekendCell`,
    today: `${PREFIX}-today`,
    weekend: `${PREFIX}-weekend`,
};

const StyledAppointmentsAppointment = styled(Appointments.Appointment)(() => ({
    [`&.${classes.appointment}`]: {
        borderRadius: "10px",
        "&:hover": {
            opacity: 0.6
        }
    }
}));

// #FOLD_BLOCK
const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
    [`&.${classes.flexibleSpace}`]: {
        flex: "none"
    },
    [`& .${classes.flexContainer}`]: {
        display: "flex",
        alignItems: "center"
    }
}));

const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => ({
    [`&.${classes.todayCell}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.14),
        },
        '&:focus': {
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
    },
    [`&.${classes.weekendCell}`]: {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        '&:hover': {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        },
        '&:focus': {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        },
    },
}));


const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(({ theme }) => ({
    [`&.${classes.today}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.16),
    },
    [`&.${classes.weekend}`]: {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.06),
    },
}));

const StyledWeekViewDayScaleEmptyCell = styled(WeekView.DayScaleEmptyCell)(({ theme }) => ({
    [`&.${classes.today}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.16),
    },
    [`&.${classes.weekend}`]: {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.06),
    },
}));

const StyledAppointmentsAppointmentContent = styled(
    Appointments.AppointmentContent
)(() => ({
    [`&.${classes.apptContent}`]: {
        "&>div>div": {
            whiteSpace: "normal !important",
            lineHeight: 1.2
        }
    }
}));


const Appointment = (restProps: any) => (
    <StyledAppointmentsAppointment
        {...restProps}
        className={classes.appointment}
    />
);

const AppointmentContent = (restProps: any) => {
    return (
        <>
            <div style={{ "margin": "0px 0px" }}>
                <b> {'Môn: '} {restProps.data.title.length < 20 ? restProps.data.title : restProps.data.title.slice(0, 20) + '...'} {' '} ({restProps.data.ScheduleType}) </b>
            </div>
            <div style={{ "margin": "0px 0px" }}>
                <b>{restProps.data.LessonName}</b>
            </div>
            <div style={{ "margin": "0px 0px" }}>
                {restProps.data.ClassCode} - {restProps.data.ClassName}
            </div>
            {/* <div style={{ "margin": "0px 0px" }}>
                {'Tiết: '} {restProps.data.StartTime} - {restProps.data.EndTime}
            </div> */}
            <div style={{ "margin": "3px 0px" }}>
                {'GV: '} {restProps.data.TeacherName}
            </div>
            <div style={{ "margin": "3px 3px" }}>
                {'Phòng: '} {restProps.data.LabName}
            </div>
        </>
    )
};

const TimeTableCell = (props: any) => {
    const { startDate } = props;
    const date = new Date(startDate);
    const currentDate = new Date();

    if (date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
        return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} />;
    } if (date.getDay() === 0 || date.getDay() === 6) {
        return <StyledWeekViewTimeTableCell {...props} className={classes.weekendCell} />;
    } return <StyledWeekViewTimeTableCell {...props} />;
};

const DayScaleCell = (props: any) => {
    const { startDate, today } = props;

    return <td style={{ "backgroundColor": today ? '#D9E9F8' : ((startDate.getDay() === 0 || startDate.getDay() === 6) ? "#F5F5F5" : 'white') }}>
        <div><b>{startDate.getDay() === 0 ? 'Chủ nhật' : "Thứ " + `${startDate.getDay() + 1}`} </b>
        </div>
        <div><b>{startDate.getDate() + "/" + `${startDate.getMonth() + 1}` + "/" + startDate.getFullYear()} </b>
        </div>
    </td>
};

const resources = [{
    fieldName: 'session',
    title: 'Ca',
    instances: [
        { text: 'Ca sáng', id: 1, color: '#3388FF' },
        { text: 'Ca chiều', id: 2, color: 'orange' },
    ],
}];

const groupOrientation = (viewName: any) => viewName.split(' ')[0];
const grouping = [{
    resourceName: 'session',
}];
// const grouping = [ 'session'];

const ScheduleTable: FC = () => {
    const scheduleData = useAppSelector((state: RootState) => state.schedule.listOfSchedules);
    const classSubjectData = useAppSelector((state: RootState) => state.classSubject.listOfClassSubjects);
    const [tableData, setTableData] = useState<any[]>([]);
    const [isCreateModal, setIsCreateModal] = useState(false);
    const [createdSchedule, setCreatedSchedule] = useState<any>();

    const handleOpenCreateModal = () => {
        setIsCreateModal(true);
    }

    const onCloseCreateModal = () => {
        // setCreatedRow(dummyLaboratoryData);
        setIsCreateModal(false);
    }
    const handleSubmitCreateModal = async () => {
    }

    const FlexibleSpace = ({ ...restProps }) => (
        <StyledToolbarFlexibleSpace  {...restProps} className={classes.flexibleSpace}>
            <div className={classes.flexContainer}>
                <Tooltip title="Tạo TKB cho lớp học phần mới" placement="right-start">
                    <Button
                        color="primary"
                        onClick={handleOpenCreateModal}
                        variant="contained"
                        style={{ "margin": "10px" }}
                    >
                        <AddIcon fontSize="small" />
                    </Button>
                </Tooltip>
            </div>
        </StyledToolbarFlexibleSpace>
    );

    useEffect(() => {
        let formatedScheduleData = scheduleData.map((sche: IScheduleType) => {
            let lessonDate = new Date(Number(sche.DateStudy) * 1000);

            return {
                ...sche,
                "id": sche.SessionId,
                "title": sche.SubjectName,
                "startDate": new Date(lessonDate.getFullYear(), lessonDate.getMonth(), lessonDate.getDate(), ...convertPeriodToHourAndMin(Number(sche.StartTime))[0]),
                "endDate": new Date(lessonDate.getFullYear(), lessonDate.getMonth(), lessonDate.getDate(), ...convertPeriodToHourAndMin(Number(sche.EndTime))[1]),
                // "rRule": 'FREQ=WEEKLY;COUNT=6',
                "session": (Number(sche.StartTime) < 7) ? 1 : 2
            }
        })
        console.log("formatedScheduleData :", formatedScheduleData)
        setTableData(formatedScheduleData);
    }, [scheduleData])

    return (
        <>
            <h3 style={{ "margin": "0px", "textAlign": "left", "padding": "8px" }}>
                <b><KeyboardArrowRightIcon
                    style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
                ></KeyboardArrowRightIcon></b>
                <span>Thông tin thời khoá biểu</span>
            </h3>
            <Paper>
                <Scheduler data={tableData} height={530}>
                    <EditingState onCommitChanges={() => { }} />
                    {/* <GroupingState
                        grouping={grouping}
                        groupOrientation={groupOrientation}
                       
                    /> */}
                    <ViewState />
                    <WeekView
                        displayName={'Tuần'}
                        startDayHour={7}
                        endDayHour={22}
                        // cellDuration={60}
                        timeTableCellComponent={TimeTableCell}
                        dayScaleCellComponent={(itemData) => <DayScaleCell itemData={itemData} />}
                        name="Vertical Orientation"
                    />
                    <MonthView
                        displayName={'Tháng'}
                    />
                    <DayView
                        displayName={'Ngày'}
                    />
                    <Appointments
                        appointmentComponent={Appointment}
                        appointmentContentComponent={AppointmentContent}
                    />
                    <Resources
                        data={resources}
                        mainResourceName="session"
                    />
                    {/* <IntegratedGrouping />
                    <GroupingPanel /> */}
                    <Toolbar
                        flexibleSpaceComponent={FlexibleSpace}
                    />
                    <ViewSwitcher />
                    <DateNavigator />
                    <EditRecurrenceMenu />
                    <AppointmentTooltip showCloseButton showDeleteButton showOpenButton />
                    <AppointmentForm />
                    <DragDropProvider />
                </Scheduler>
            </Paper>
            <Dialog open={isCreateModal}>
                <DialogTitle textAlign="center"><b>Tạo TKB cho lớp học phần mới</b></DialogTitle>
                <DialogContent>
                    <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
                        <Stack
                            sx={{
                                width: '100%',
                                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                                gap: '1.5rem',
                            }}
                        >

                            <FormControl sx={{ m: 0, minWidth: 120 }}>
                                <InputLabel id="department-select-required-label">Lớp học phần</InputLabel>
                                <Select
                                    labelId="department-select-required-label"
                                    id="department-select-required"
                                    // value={lessonLabData.findIndex(x => x.DepartmentId === updatedRow.DepartmentId) > -1 ?
                                    //     departmentData.findIndex(x => x.DepartmentId === updatedRow.DepartmentId).toString() : ""}
                                    label="Lớp học phần"
                                    onChange={(e: SelectChangeEvent) => { }}
                                >
                                    {classSubjectData.map((x, idx) => <MenuItem value={idx}>{x.ClassName}-{x.TeacherName}</MenuItem>)}
                                </Select>
                            </FormControl>

                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    label="Ngày bắt đầu"
                                    value={Date.now()}
                                    onChange={(val: any) =>
                                        setCreatedSchedule({
                                            ...createdSchedule,

                                        })
                                    }
                                    renderInput={(params: any) => <TextField {...params} />}
                                    inputFormat='DD/MM/YYYY'
                                />
                            </LocalizationProvider>
                            {['Tiết bắt đầu', 'Tiết kết thúc', 'Lặp lại (tuần)'].map(x => <TextField
                                key={x}
                                label={x}
                                name={x}
                                defaultValue={0}
                            // onChange={(e) =>
                            //     setUpdatedRow({ ...updatedRow, [e.target.name]: e.target.value })
                            // }
                            />)}
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={onCloseCreateModal}>Huỷ</Button>
                    <Button color="primary" onClick={handleSubmitCreateModal} variant="contained">
                        Tạo
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
};

export default ScheduleTable;