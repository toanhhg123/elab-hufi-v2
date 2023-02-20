import React, { FC, useEffect, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from '@mui/material';
import { IResearcherType } from '../../../types/researchTeamType';
import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Genders, ResearchTeamTitles } from '../../../configs/enums';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { setCurrentMemberTeam } from '../researchTeamSlice';

const CreateMemberTeamModal: FC<{
    isOpen: boolean;
    columns: MRT_ColumnDef<IResearcherType>[];
    onClose: any;
    handleSubmit: any;
}> = ({ isOpen, columns, onClose, handleSubmit }) => {
    const { currentMemberTeam, currentResearchTeam } = useAppSelector((state: RootState) => state.researchTeam);
    const researchersData = useAppSelector((state: RootState) => state.researchTeam.listOfResearchers);
    const dispatch = useAppDispatch();

    const [researcherDataValue, setResearcherDataValue] = useState<any>([]);

    useEffect(() => {
        if (researchersData.length > 0) {
            const listOfCurrentMembers = currentResearchTeam.listMember.map(x => x.ResearcherId);
            const filteredResearchersData = researchersData.filter(item => item?.ResearcherId && !listOfCurrentMembers.includes(item.ResearcherId))
            const list = filteredResearchersData.map(x => ({
                label: `${x.ResearcherId} - ${x.Fullname}`,
                id: x.ResearcherId,
                name: x.Fullname
            }));
            setResearcherDataValue(list);
        }
    }, [currentResearchTeam, researchersData])

    return (
        <Dialog open={isOpen}>
            <DialogTitle textAlign="center"><b>Thêm thông tin thành viên</b></DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >
                        {columns.map((column) => {
                            if (column.accessorKey === "formatedBirthdate") {
                                return <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        disabled
                                        key={"CreateBirthdate"}
                                        label="Ngày sinh"
                                        value={new Date(Number(currentMemberTeam.Birthdate) * 1000)}
                                        onChange={(val: any) =>
                                            dispatch(setCurrentMemberTeam({
                                                ...currentMemberTeam,
                                                "formatedBirthdate": moment.unix(Date.parse(val) / 1000).format('DD/MM/YYYY'),
                                                "Birthdate": Date.parse(val) / 1000
                                            }))
                                        }
                                        renderInput={(params: any) => <TextField key={"CreateBirthdateTextField"} {...params} />}
                                        inputFormat='DD/MM/YYYY'
                                    />
                                </LocalizationProvider>
                            }
                            else if (column.accessorKey === "Fullname") {
                                return <></>
                            }
                            else if (column.accessorKey === "Gender") {
                                return <FormControl sx={{ m: 0, minWidth: 120 }}>
                                    <InputLabel id="create-select-required" key="create-input-gender">Giới tính</InputLabel>
                                    <Select
                                        disabled
                                        key="create-select-gender"
                                        labelId="create-select-required"
                                        id="create-select-required"
                                        value={Genders[currentMemberTeam.Gender].toString()}
                                        label="Giới tính"
                                    >
                                        {Object.values(Genders).slice(0, (Object.values(Genders).length + 1) / 2)
                                            .map((x, idx) => <MenuItem key={"CreateGender" + idx} value={idx}>{x}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            }
                            else if (column.accessorKey === "Title") {
                                return <FormControl sx={{ m: 0, minWidth: 120 }}>
                                    <InputLabel id="create-select-title-required" key="create-title-title">Chức vụ</InputLabel>
                                    <Select
                                        key="create-select-title"
                                        labelId="create-select-title-required"
                                        id="create-select-title-required"
                                        value={currentMemberTeam?.Title && ResearchTeamTitles[currentMemberTeam.Title].toString()}
                                        label="Chức vụ"
                                        onChange={(e: SelectChangeEvent) =>
                                            dispatch(setCurrentMemberTeam({
                                                ...currentMemberTeam,
                                                "Title": ResearchTeamTitles[Number(e.target.value)] as keyof typeof ResearchTeamTitles
                                            }))}
                                    >
                                        {Object.values(ResearchTeamTitles).slice(0, (Object.values(ResearchTeamTitles).length + 1) / 2)
                                            .map((x, idx) => <MenuItem key={"CreateTitle" + idx} value={idx}>{x}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            }
                            else if (column.accessorKey === "ResearcherId") {
                                return <Autocomplete
                                    key={"ResearcherName"}
                                    options={researcherDataValue}
                                    noOptionsText="Không có kết quả trùng khớp"
                                    sx={{ "width": "450px" }}
                                    value={researcherDataValue.find((x: any) => x.id === currentMemberTeam.ResearcherId) || null}
                                    getOptionLabel={option => option?.label}
                                    renderInput={params => {
                                        return (
                                            <TextField
                                                {...params}
                                                label={"Nhà nghiên cứu"}
                                                placeholder="Nhập để tìm kiếm"
                                            />
                                        );
                                    }}
                                    onChange={(event, value) => {
                                        let memberInfo = researchersData.find(item => item.ResearcherId === value?.id);
                                        dispatch(setCurrentMemberTeam({
                                            ...currentMemberTeam,
                                            ...memberInfo,
                                            "ResearcherId": value?.id,
                                            "Fullname": value?.name,
                                        }));
                                    }}
                                />
                            }
                            else {
                                return <TextField
                                    disabled
                                    key={"create" + column.accessorKey}
                                    label={column.header}
                                    name={column.accessorKey}
                                    value={column.accessorKey && currentMemberTeam[column.accessorKey]}
                                />
                            }
                        }
                        )}

                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>Hủy</Button>
                <Button color="primary" onClick={handleSubmit} variant="contained">
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(CreateMemberTeamModal);
