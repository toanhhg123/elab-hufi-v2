import React, { FC, useCallback, useEffect, useState } from 'react';

import Scheduler, { Resource } from 'devextreme-react/scheduler';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Paper from '@mui/material/Paper';
import { isToday, sessionData } from './utils';
import { RootState } from '../../store';
import { IScheduleType } from '../../types/scheduleType';
import { useAppSelector } from '../../hooks';
// import Button from "devextreme/ui/button";
import './scheduleStyle.css';
import * as API from '../../configs/apiHelper';
import Button from '@mui/material/Button';
import { MenuItem, Select } from '@mui/material';

const views = [
    {
        type: 'timelineMonth',
        name: 'Tháng',
        maxAppointmentsPerCell: 1,
    }];

const groups = ['session'];

const DateScaleCell = (props: any) => {
    const { date } = props.itemData;
    const formatedDate = new Date(date);

    return <div style={{ "height": "100%", "width": "100%", "backgroundColor": isToday(date) ? '#D9E9F8' : ((formatedDate.getDay() === 0 || formatedDate.getDay() === 6) ? "#F5F5F5" : '#E8ECF3') }}>
        <div><b>{formatedDate.getDay() === 0 ? 'Chủ nhật' : "Thứ " + `${formatedDate.getDay() + 1}`} </b>
        </div>
        <div><b>{formatedDate.getDate() + "/" + `${formatedDate.getMonth() + 1}` + "/" + formatedDate.getFullYear()} </b>
        </div>
    </div>
};

const TimeScaleCell = (props: any) => {
    const { text } = props.itemData;
    return <div style={{
        "height": "100%",
        "width": "100%",
        "display": "flex",
        "justifyContent": "center",
        "alignItems": "center",
        "backgroundColor": "#FFFFCE"
    }}>
        {text}
    </div>
}

const DataScaleCell = (props: any) => {
    const { startDate } = props.itemData;
    const formatedDate = new Date(startDate);

    return <div style={{
        "height": "100%",
        "width": "100%",
        "backgroundColor": isToday(startDate) ? '#D9E9F8' : ((formatedDate.getDay() === 0 || formatedDate.getDay() === 6) ? "#F5F5F5" : 'white')
    }}>
        {props.children}
    </div>
};


const AppointmentContentCell = (restProps: any) => {
    const { appointmentData } = restProps.itemData;
    return (
        <div style={{ "fontSize": '10px', "color": 'black' }}>
            <div style={{ "margin": "0px 0px" }}>
                <b> {'Môn: '} {appointmentData.title.length < 15 ? appointmentData.title : appointmentData.title.slice(0, 15) + '...'} {' '} ({appointmentData.ScheduleType}) </b>
            </div>
            <div style={{ "margin": "0px 0px" }}>
                <b>{appointmentData.LessonName}</b>
            </div>
            <div style={{ "margin": "0px 0px" }}>
                {appointmentData.ClassCode} - {appointmentData.ClassName}
            </div>
            <div style={{ "margin": "10px 0px" }}>
                {'Tiết: '} {appointmentData.StartTime} - {appointmentData.EndTime}
            </div>
            {/* <div style={{ "margin": "3px 0px" }}>
                    {'GV: '} {appointmentData.TeacherName}
                </div> */}
            <div style={{ "margin": "0px 3px" }}>
                {'Phòng: '} {appointmentData.LabName}
            </div>
        </div>
    )
};

const ScheduleTable: FC = () => {
    const scheduleData = useAppSelector((state: RootState) => state.schedule.listOfSchedules);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [tableData, setTableData] = useState<any[]>([]);
    const [uploadedFile, setUploadFile] = useState(null);
    const [imagePreview, setImagePreview] = useState<any>();
    const [selectedSemester, setSelectedSemester] = useState<number>(1);
    const [selectedSchoolyear, setSelectedSchoolyear] = useState<string>('2022-2023');

    // const customizeDateNavigatorText = useCallback((e: any) => {
    //     const formatOptions = { 
    //         year: 'numeric', 
    //         month: 'numeric', 
    //         day: 'numeric' 
    //     };
    //     const formattedStartDate = e.startDate.toLocaleString('en', formatOptions);
    //     const formattedEndDate = e.endDate.toLocaleString('en', formatOptions);
    //     if(currentView === 'day' || 'timelineDay') 
    //         return formattedStartDate;
    //     if(currentView === 'month' ) 
    //         return e.startDate.toLocaleString('en', { year: 'numeric', month: 'numeric' });
    //     return formattedStartDate + ' - ' + formattedEndDate;
    // }, [currentView]);

    // const handlePropertyChange = useCallback((e: any) => {
    //     if (e.name === 'currentDate') {
    //         setCurrentDate(e.value);
    //     }
    // }, [])

    // const onContentReady = () => {
    //     const todayButton = document.getElementById('schedulerTodayButton');
    //     if (!todayButton) {
    //         let element = document.querySelectorAll('.dx-scheduler-navigator');
    //         const container = document.createElement('div');
    //         container.id = 'schedulerTodayButton';

    //         container.setAttribute("style", "display: inline-block;  margin: 9px 0px;");
    //         element[0].setAttribute("style", "display: flex;");
    //         element[0].appendChild(container);

    //         new Button(container, {
    //             text: 'Hiện tại',
    //             onClick: () => {
    //                 setCurrentDate(new Date());
    //             }
    //         });
    //     }
    // }

    // useEffect(() => {
    //     onContentReady();
    // }, [document.getElementById('schedulerTodayButton')])

    const handleImagePreview = (e: any) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];

        setImagePreview(image_as_base64);
        setUploadFile(image_as_files);
    }

    const handleSubmitFile = async () => {

        if (uploadedFile !== null) {
            // let formData = new FormData();
            // formData.append('', uploadedFile);
            let formData = {
                uploadedFile,
                Semester: '1',
                Schoolyear: '2022-2023'
            }

            await API.post(
                "https://www.aspsite.somee.com/api/Schedules/importFile",
                formData,
                {
                    headers: {
                        // "Authorization": "YOUR_API_AUTHORIZATION_KEY_SHOULD_GOES_HERE_IF_HAVE",
                        "Content-type": "multipart/form-data",
                    },
                }
            )
                .then((res: any) => {
                    console.log(`Success` + res.data);
                })
                .catch((err: any) => {
                    console.log(err);
                })
        }
    }

    const handleSelectSemester = (e: any) => {
        setSelectedSemester(e.value);
    }

    useEffect(() => {
        let formatedScheduleData = scheduleData.map((sche: IScheduleType) => {
            let lessonDate = new Date(Number(sche.DateStudy) * 1000);

            return {
                ...sche,
                "id": sche.SessionId,
                "title": sche.SubjectName,
                "startDate": new Date(lessonDate.getFullYear(), lessonDate.getMonth(), lessonDate.getDate(), 0, 0),
                "endDate": new Date(lessonDate.getFullYear(), lessonDate.getMonth(), lessonDate.getDate(), 23, 59),
                "session": (Number(sche.StartTime) < 7) ? 1 : ((12 < Number(sche.StartTime)) ? 3 : 2)
            }
        })
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
            <Paper sx={{ "height": "78vh" }}>
                <div style={{ "float": "left", "margin": "10px 50px" }}>
                    {/* image preview */}
                    {/* <img src={imagePreview} alt="image preview" /> */}
                    <b style={{ "fontSize": "15px", "paddingRight": "10px" }}>File TKB: </b>
                    <input
                        type="file"
                        onChange={handleImagePreview}
                    />

                    <b style={{ "fontSize": "15px", "paddingRight": "3px" }}>Học kỳ: </b>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedSemester}
                        label="Age"
                        onChange={handleSelectSemester}
                        style={{ "height": "25px", "margin": "0 15px" }}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                    </Select>
                    <b style={{ "fontSize": "15px", "paddingRight": "3px" }}>Năm học: </b>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedSchoolyear}
                        label="Age"
                        onChange={handleSelectSemester}
                        style={{ "height": "25px", "margin": "0 15px" }}
                    >
                        <MenuItem value={'2022-2023'}>2022-2023</MenuItem>
                        <MenuItem value={'2021-2022'}>2021-2022</MenuItem>
                        <MenuItem value={'2020-2021'}>2020-2021</MenuItem>
                    </Select>
                    <Button onClick={handleSubmitFile} variant="contained" style={{ "height": "25px" }}> Upload </Button>
                </div>

                <Scheduler
                    dataSource={tableData}
                    views={[
                        {
                            type: 'timelineWeek',
                            name: 'Tuần',
                            maxAppointmentsPerCell: 1,
                        },
                    ]}
                    defaultCurrentView="timelineWeek"
                    // customizeDateNavigatorText={customizeDateNavigatorText}
                    currentDate={currentDate}
                    cellDuration={1440}
                    // onOptionChanged={handlePropertyChange}
                    height={"72vh"}
                    groups={groups}
                    firstDayOfWeek={1}
                    showCurrentTimeIndicator={false}
                    // onContentReady={onContentReady}
                    // adaptivityEnabled={true}
                    // startDayHour={7}
                    // endDayHour={22}
                    dataCellRender={(itemData: any) => <DataScaleCell itemData={itemData} />}
                    dateCellRender={(itemData: any) => <DateScaleCell itemData={itemData} />}
                    resourceCellRender={(itemData: any) => <TimeScaleCell itemData={itemData} />}
                    appointmentRender={(itemData: any) => <AppointmentContentCell itemData={itemData} />}
                >
                    <Resource
                        fieldExpr="session"
                        allowMultiple={false}
                        dataSource={sessionData}
                        label="session"
                        useColorAsDefault={true}
                    />
                </Scheduler>
            </Paper>
        </>
    )
}

export default ScheduleTable;