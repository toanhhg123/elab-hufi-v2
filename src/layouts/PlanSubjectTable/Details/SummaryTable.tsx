import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
import styled from '@emotion/styled';
import { getPlanningSummary } from '../../../services/planSubjectServices';
import { IDeptSummaryType } from '../../../types/planSubjectType';
import { RootState } from '../../../store';
import { useAppSelector } from '../../../hooks';
import { IDepartmentType } from '../../../types/departmentType';

const StyledTableCell = styled(TableCell)(theme => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'lightgray',
        width: '200px'
    },
}));

const semesterValue = ['1', '2', '3'];
const schoolYearValue = ['2020-2021', '2021-2022', '2022-2023'];

type SuggestionProps = {
    Semester: string;
    Schoolyear: string;
    DepartmentId: string;
    DepartmentName?: string;
};

const dummyPlanSubjectSuggestion: SuggestionProps = {
    "Semester": "1",
    "Schoolyear": "2022-2023",
    "DepartmentId": "",
    "DepartmentName": ""
}

const SummaryTable: FC<{
    isOpen: boolean,
    onClose: () => void,
}> = ({ isOpen, onClose }) => {
    const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);
    const [tableData, setTableData] = useState<IDeptSummaryType[]>([]);
    const [setOfSubjects, setSetOfSubjects] = useState<any[]>([]);
    const [suggestedPlanning, setSuggestedPlanning] = useState<SuggestionProps>(dummyPlanSubjectSuggestion);
    const [deptDataValue, setDeptDataValue] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    useEffect(() => {
        if (departmentData.length > 0) {
            const list = departmentData.map((x: IDepartmentType) => ({
                label: `${x.DepartmentId} - ${x.DepartmentName}`,
                id: x.DepartmentId,
                name: x.DepartmentName
            }));
            setDeptDataValue(list);
        }
    }, [departmentData])

    const generalColumns = [
        {
            id: "ChemicalId",
            name: "Mã HC"
        },
        {
            id: "ChemicalName",
            name: "Tên HC"
        },
        {
            id: "Specifications",
            name: "Đặc tính kỹ thuật"
        },
        {
            id: "Unit",
            name: "Đơn vị tính"
        },
        {
            id: "AmountTotal",
            name: "Số lượng tổng"
        },
    ]

    const getSummaryData = async () => {
        setLoading(true);
        let summaryData: IDeptSummaryType[] = await getPlanningSummary(suggestedPlanning.Semester, suggestedPlanning.Schoolyear, suggestedPlanning.DepartmentId);
        if (summaryData) {
            setLoading(false);
            setTableData(summaryData);
            (summaryData.length === 0) ? setIsEmpty(true) : setIsEmpty(false);
            let allPlanning = summaryData.map(item => item.listSubject);
            let allPlanningFlatten = allPlanning.flat();
            let uniq = allPlanningFlatten.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.PlanId === value.PlanId
                ))
            )
            setSetOfSubjects(uniq);
        }
    }

    useEffect(() => {
        return () => {
            if (!isOpen) {
                setTableData([]);
                setLoading(false);
                setIsEmpty(false);
                setSetOfSubjects([]);
                setSuggestedPlanning(dummyPlanSubjectSuggestion);
            }
        }
    }, [isOpen])

    return (
        <>
            <Dialog open={isOpen}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "1000px",  // Set your width here
                        },
                    },
                }}
            >
                <DialogTitle textAlign="center"><b>Tổng hợp dự trù hoá chất</b></DialogTitle>
                <DialogContent>
                    <div className='searchSummary' style={{ "display": "flex", marginTop: "10px" }}>
                        <Typography variant="h6" noWrap component="div" sx={{ mt: 1, mr: 3, minWidth: 50 }}>
                            Tra cứu:
                        </Typography>
                        <FormControl sx={{ m: 0, mr: 1, minWidth: 100 }} key={"semesterSuggestion"}>
                            <InputLabel id="Semester-select-required-label-suggestion">Học kỳ</InputLabel>
                            <Select
                                labelId="Semester-select-required-label-suggestion"
                                id="Semester-select-required-suggestion"
                                value={
                                    semesterValue.findIndex(x => x === suggestedPlanning.Semester.toString()) > -1
                                        ? semesterValue
                                            .findIndex(x => x === suggestedPlanning.Semester.toString())
                                            .toString()
                                        : '1'
                                }
                                label="Học kỳ"
                                onChange={(e: SelectChangeEvent) =>
                                    setSuggestedPlanning({
                                        ...suggestedPlanning,
                                        Semester: semesterValue[Number(e.target.value)],
                                    })
                                }
                            >
                                {semesterValue.map((x, idx) => (
                                    <MenuItem key={idx} value={idx}>
                                        {x}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 0, mr: 1, minWidth: 200 }} key={"schoolYearSuggestion"}>
                            <InputLabel id="schoolYear-select-required-label-suggestion">Năm học</InputLabel>
                            <Select
                                labelId="schoolYear-select-required-label-suggestion"
                                id="schoolYear-select-required-suggestion"
                                value={
                                    schoolYearValue.findIndex(x => x === suggestedPlanning.Schoolyear.toString()) > -1
                                        ? schoolYearValue
                                            .findIndex(x => x === suggestedPlanning.Schoolyear.toString())
                                            .toString()
                                        : '2022-2023'
                                }
                                label="Năm học"
                                onChange={(e: SelectChangeEvent) =>
                                    setSuggestedPlanning({
                                        ...suggestedPlanning,
                                        Schoolyear: schoolYearValue[Number(e.target.value)],
                                    })
                                }
                            >
                                {schoolYearValue.map((x, idx) => (
                                    <MenuItem key={idx} value={idx}>
                                        {x}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Autocomplete
                            key={"deptSuggestion"}
                            options={deptDataValue}
                            style={{ margin: 0, marginRight: 8, minWidth: 350 }}
                            noOptionsText="Không có kết quả trùng khớp"
                            disableClearable
                            value={deptDataValue.find((x: any) => x.id === suggestedPlanning.DepartmentId) || null}
                            getOptionLabel={option => option?.label}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        label={"Khoa/phòng ban"}
                                        placeholder="Nhập để tìm kiếm"
                                    />
                                );
                            }}
                            onChange={(event, value) => {
                                setSuggestedPlanning({
                                    ...suggestedPlanning,
                                    "DepartmentId": value?.id,
                                    "DepartmentName": value?.name,
                                });
                            }}
                        />
                        <Button
                            sx={{ minWidth: 100, marginRight: 2 }}
                            color="primary"
                            onClick={getSummaryData}
                            variant="contained">
                            Tìm kiếm
                        </Button>
                        {loading && <CircularProgress disableShrink sx={{ size: 100 }} />}
                    </div>
                    {isEmpty && <Typography variant="h6" noWrap component="div" sx={{ mt: 2 }}>Không có tổng hợp dữ trù </Typography>}
                    {(setOfSubjects.length > 0 && !loading) && <TableContainer
                        component={Paper}
                        sx={{
                            maxHeight: '400px',
                            marginBottom: '24px',
                            overflow: 'overlay',
                            marginTop: "10px"
                        }}>
                        <Table sx={{ minWidth: 650 }} stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {generalColumns.map((col, idx) => {
                                        return (
                                            <>
                                                <StyledTableCell
                                                    align="center"
                                                    key={col.id}
                                                    sx={{ width: 200, border: 'none' }}
                                                >
                                                    <div className="generalPlanningCol" style={{ "display": "flex", "flexDirection": "column", "width": "200px" }}>
                                                        <b>{col.name}</b>
                                                        {idx === 4 ?
                                                            <b>
                                                                ({idx + 1})={setOfSubjects.map((x, idx1) => (idx1 < setOfSubjects.length - 1)
                                                                    ? <span>({idx1 + 6})+</span>
                                                                    : <span>({idx1 + 6})</span>)}</b>
                                                            : <b>({idx + 1})</b>}
                                                    </div>
                                                </StyledTableCell>
                                            </>
                                        );
                                    })}
                                    <StyledTableCell align="center">
                                        <b>Số lượng đề nghị</b>
                                        <div className="planningRows" style={{ "display": "flex" }}>
                                            {setOfSubjects.map((x, idx) =>
                                                <div className="planningCol" style={{ "display": "flex", "flexDirection": "column" }}>
                                                    <StyledTableCell align="center">
                                                        <b>{x.PlanId}</b>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <b>{x.SubjectName}</b>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <b>({idx + 6})</b>
                                                    </StyledTableCell>
                                                </div>
                                            )}
                                        </div>
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((item, index) => <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    {generalColumns.map(col => <TableCell align="center" key={col.id} sx={{ width: 200 }}>
                                        {item[col.id as keyof typeof item]
                                            ? `${item[col.id as keyof typeof item]}`
                                            : ''}
                                    </TableCell>)}
                                    <TableCell align="center" key="aggregatedCell">
                                        {item.listSubject.map((x, idx) => {
                                            return setOfSubjects.map((y, idx1) => {
                                                if (x.PlanId === y.PlanId) {
                                                    return <TableCell align="center" key={idx1} sx={{ width: 200, border: 'none' }}>
                                                        {x.AmountSubTotal}
                                                    </TableCell>
                                                }
                                            })
                                        })}
                                    </TableCell>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    </TableContainer>}
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={onClose}>Hủy</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SummaryTable;
