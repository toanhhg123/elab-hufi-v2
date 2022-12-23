import React, { FC, useCallback, useEffect, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    tableCellClasses,
    Typography,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
    Autocomplete,
    TextField,
    CircularProgress
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import styled from '@emotion/styled';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import { setSnackbarMessage } from '../../pages/appSlice';
import { IScheduleType } from '../../types/scheduleType';

const StyledTableCell = styled(TableCell)(theme => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'lightgray',
        // width: '200px'
    },
}));

const ScheduleTable: FC = () => {
    const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
    const scheduleData = useAppSelector((state: RootState) => state.schedule.listOfSchedules);
    const [fromTime, setFromTime] = useState<any>(new Date().getTime() / 1000);
    const [toTime, setToTime] = useState<any>(new Date().getTime() / 1000);
    const [listDate, setListDate] = useState<string[]>([moment.unix(new Date().getTime() / 1000).format('DD/MM/YYYY')]);
    const [listDay, setListDay] = useState<number[]>([new Date().getDay()]);
    const [listLessonClass, setListLessonClass] = useState<IScheduleType[]>([]);

    const dispatch = useAppDispatch();

    const getSchedule = () => {
        if (fromTime > toTime) {
            dispatch(setSnackbarMessage('Từ ngày phải nhỏ hơn Đến ngày'));
        }
        else if (toTime - fromTime > 604800) {
            dispatch(setSnackbarMessage('Vui lòng tra cứu thời gian từ 1 tuần trở xuống'));
        } else {
            console.log("toTime fromTime :", toTime, fromTime)
            console.log("fdfdf22 :", new Date().getDay())
            let tempListDate = [];
            let tempListDay = [];
            for (let x = fromTime; x <= toTime; x += 86400) {
                tempListDate.push(moment.unix(x).format('DD/MM/YYYY'));
                tempListDay.push(new Date(x * 1000).getDay());
            }
            console.log("tempListDate :", tempListDate)
            setListDate(tempListDate);
            setListDay(tempListDay);

            let tempSchedule = scheduleData.filter(item => fromTime <= Number(item.DateStudy) && Number(item.DateStudy) <= toTime)
                .map(x => Object.assign({}, {
                    ...x,
                    "formatedDateStudy": moment.unix(Number(x.DateStudy)).format('DD/MM/YYYY')
                }));
            setListLessonClass(tempSchedule);
            console.log("tempSchedule :", tempSchedule)
        }
    }

    return <>
        <h3 style={{ "margin": "0px", "textAlign": "left", "padding": "8px" }}>
            <b><KeyboardArrowRightIcon
                style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
            ></KeyboardArrowRightIcon></b>
            <span>Thông tin thời khoá biểu</span>
        </h3>
        <div className='searchSchedule' style={{ "display": "flex", marginTop: "10px" }}>
            <Typography variant="h6" noWrap component="div" sx={{ mt: 1, ml: 3, mr: 3, minWidth: 50 }}>
                Từ
            </Typography>
            <LocalizationProvider dateAdapter={AdapterMoment} sx={{ mr: 3 }}>
                <DatePicker
                    label="Từ ngày"
                    value={new Date(fromTime * 1000)}
                    onChange={(val: any) => {
                        console.log("dfdfdf :", 86400 * Math.floor(Date.parse(val) / (1000 * 86400)))
                        setFromTime(86400 * Math.floor(Date.parse(val) / (1000 * 86400)))
                    }

                    }
                    renderInput={(params: any) => <TextField {...params} />}
                    inputFormat='DD/MM/YYYY'
                />
            </LocalizationProvider>
            <Typography variant="h6" noWrap component="div" sx={{ mt: 1, ml: 3, mr: 3, minWidth: 50 }}>
                Đến
            </Typography>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                    label="Đến ngày"
                    value={new Date(toTime * 1000)}
                    onChange={(val: any) => {
                        setToTime(86400 * Math.ceil(Date.parse(val) / (1000 * 86400)))
                    }

                    }
                    renderInput={(params: any) => <TextField {...params} />}
                    inputFormat='DD/MM/YYYY'
                />
            </LocalizationProvider>
            <Button
                sx={{ minWidth: 100, ml: 3, marginRight: 3 }}
                color="primary"
                onClick={getSchedule}
                variant="contained">
                Tra cứu
            </Button>
            <Button
                sx={{ minWidth: 100, ml: 3, marginRight: 3 }}
                color="warning"
                // onClick={getSchedule}
                variant="contained">
                Tự động sắp TKB
            </Button>
        </div>
        <TableContainer
            component={Paper}
            sx={{
                // maxHeight: '400px',
                marginBottom: '24px',
                overflow: 'overlay',
                marginTop: "10px"
            }}>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        {['Ngày trong tháng', 'Thứ', 'Phòng'].map((item, idx) => {
                            return (
                                <StyledTableCell
                                    align="center"
                                    key={'empty' + `${idx}`}
                                    sx={{ border: '1px solid', width: "100px", "padding": "0px 4px" }}

                                >
                                    <b> {item} </b>
                                </StyledTableCell>
                            )
                        })}
                        <div className="headCols" style={{ "display": "flex", }}>
                            {['SÁNG', 'CHIỀU', 'TỐI'].map((item, index) => {
                                return (
                                    <>
                                        <StyledTableCell
                                            align="center"
                                            key={item}
                                            sx={{ border: 'none', p: 0 }}
                                            colSpan={7}
                                        >
                                            <div style={{ "padding": '8px 0px', border: "1px solid" }}> <b > {item} </b> </div>
                                            <div className="subSecondHeadGroup" style={{ "display": "flex" }}>
                                                {['Lớp', 'Nhóm', 'Môn học', 'GV', 'Buổi', 'Nội dụng', 'Trực'].map((ele, idx) => {
                                                    return <StyledTableCell align="center" key={ele + idx} sx={{ border: "1px solid", width: '200px', "padding": "4px 0px" }} colSpan={1}>
                                                        <b> {ele} </b>
                                                    </StyledTableCell>
                                                })}
                                            </div>
                                        </StyledTableCell>
                                    </>
                                )
                            })}
                        </div>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listDate.map((item, index) =>
                        <TableRow key={index}>
                            <TableCell align="center" key="dateCol" sx={{ width: "100px", padding: "0px", border: '1px solid' }}>
                                <b>{item}</b>
                            </TableCell>
                            <TableCell align="center" key="dayCol" sx={{ width: "100px", padding: "0px", border: '1px solid' }}>
                                <b>{listDay[index] === 0 ? 'CN' : 'T' + `${listDay[index]}`}</b>
                            </TableCell>
                            <TableCell align="center" key="labCol" sx={{ padding: "0px" }}>
                                <div className="labCols" style={{ "display": "flex", "flexDirection": "column" }}>
                                    {laboratoriesData.map((lab, labIdx) => {
                                        return (
                                            <TableCell align="center" key={'lab' + lab.LabId + item} sx={{ border: '1px solid', height: "60px", padding: "0px" }}>
                                                <b>{lab.LabId}</b>
                                            </TableCell>
                                        )
                                    })}
                                </div>
                            </TableCell>
                            {(listLessonClass.length == 0 ||
                                listLessonClass.every((lessonClass: IScheduleType) => lessonClass.formatedDateStudy !== item)) ?
                                <div className="bodyCols" style={{ "display": "flex" }}>
                                    {['SÁNG', 'CHIỀU', 'TỐI'].map(ele => {
                                        return (
                                            <>
                                                <TableCell
                                                    align="center"
                                                    colSpan={7}
                                                    key={"row" + ele}
                                                    sx={{ border: '1px solid', width: '1400px', p: 0 }}
                                                >

                                                    <div className="labBodyCols" style={{ "display": "flex", "flexDirection": "column" }}>
                                                        {laboratoriesData.map((lab, labIdx) => {
                                                            return <div className="subSecondBodyGroup" style={{ "display": "flex" }}>
                                                                {['Lớp', 'Nhóm', 'Môn học', 'GV', 'Buổi', 'Nội dụng', 'Trực'].map((ele, idx) => {
                                                                    return <TableCell align="center" key={ele + idx} sx={{ border: '1px solid', width: '200px', height: "60px", p: 0 }} colSpan={1}>
                                                                    </TableCell>
                                                                })}
                                                            </div>
                                                        })}
                                                    </div>
                                                </TableCell>
                                            </>
                                        )
                                    })}
                                </div>
                                :
                                <div className="bodyCols" style={{ "display": "flex" }}>
                                    {['SÁNG', 'CHIỀU', 'TỐI'].map(ele => {
                                        return (
                                            <>
                                                <TableCell
                                                    align="center"
                                                    colSpan={7}
                                                    key={item + ele}
                                                    sx={{ border: '1px solid', width: '1400px', p: 0 }}
                                                >
                                                    <div className="labBodyCols" style={{ "display": "flex", "flexDirection": "column" }}>
                                                        {laboratoriesData.map((lab, labIdx) => {
                                                            return listLessonClass.map((lessonClass) => {
                                                                if (lessonClass.LabId === lab.LabId &&
                                                                    lessonClass.formatedDateStudy === item &&
                                                                    ((0 < Number(lessonClass.StartTime) && Number(lessonClass.StartTime < 7 && ele === 'SÁNG')) ||
                                                                        (6 < Number(lessonClass.StartTime) && Number(lessonClass.StartTime < 13 && ele === 'CHIỀU')) ||
                                                                        (6 < Number(lessonClass.EndTime) && Number(lessonClass.EndTime < 13 && ele === 'CHIỀU')) ||
                                                                        (12 < Number(lessonClass.EndTime) && ele === 'TỐI')
                                                                    )
                                                                ) {
                                                                    return <div className="subSecondBodyGroup" style={{ "display": "flex" }}>
                                                                        {['ClassName', 'ClassCode', 'SubjectName', 'TeacherName', 'Buổi', 'LessonName', 'Trực'].map((classAttr: string, classAttrIdx) => {
                                                                            return <TableCell
                                                                                align="center"
                                                                                key={ele + classAttr + classAttrIdx}
                                                                                sx={{
                                                                                    border: '1px solid',
                                                                                    width: '200px',
                                                                                    height: "60px",
                                                                                    p: 0
                                                                                }}
                                                                                colSpan={1}>
                                                                                <b>{(classAttr !== 'Buổi' && classAttr !== 'Trực') ? lessonClass[classAttr as keyof IScheduleType]?.toString() : ""}</b>
                                                                            </TableCell>
                                                                        })}
                                                                    </div>
                                                                } else {
                                                                    return <div className="subSecondBodyGroup" style={{ "display": "flex" }}>
                                                                        {['Lớp', 'Nhóm', 'Môn học', 'GV', 'Buổi', 'Nội dụng', 'Trực'].map((classAttr, classAttrIdx) => {
                                                                            return <TableCell align="center" key={classAttr + classAttrIdx} sx={{ border: '1px solid', width: '200px', height: "60px", p: 0 }} colSpan={1}>
                                                                            </TableCell>
                                                                        })}
                                                                    </div>
                                                                }
                                                            })
                                                        })}
                                                    </div>
                                                </TableCell>
                                            </>
                                        )
                                    })}
                                </div>
                            }
                        </TableRow>
                    )}
                    {/* </div> */}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}

export default ScheduleTable;