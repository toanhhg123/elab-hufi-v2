import React, { FC } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import {
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
import { IListMemberType } from '../../../types/researchTeamType';
import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Genders, ResearchTeamTitles } from '../../../configs/enums';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { setCurrentMemberTeam } from '../researchTeamSlice';

const EditMemberTeamModal: FC<{
    isOpen: boolean;
    columns: MRT_ColumnDef<IListMemberType>[];
    onClose: any;
    handleSubmit: any;
}> = ({ isOpen, columns, onClose, handleSubmit }) => {
    const { currentMemberTeam } = useAppSelector((state: RootState) => state.researchTeam);
    const dispatch = useAppDispatch();

    return (
        <Dialog open={isOpen}>
            <DialogTitle textAlign="center"><b>Sửa thông tin thành viên</b></DialogTitle>
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
                            if (column.accessorKey === "formatedBirthday") {
                                return <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        key={"CreateBirthday"}
                                        label="Ngày sinh"
                                        value={new Date(Number(currentMemberTeam.Birthday) * 1000)}
                                        onChange={(val: any) =>
                                            dispatch(setCurrentMemberTeam({
                                                ...currentMemberTeam,
                                                "formatedBirthday": moment.unix(Date.parse(val) / 1000).format('DD/MM/YYYY'),
                                                "Birthday": Date.parse(val) / 1000
                                            }))
                                        }
                                        renderInput={(params: any) => <TextField key={"CreateBirthdayTextField"} {...params} />}
                                        inputFormat='DD/MM/YYYY'
                                    />
                                </LocalizationProvider>
                            }
                            else if (column.accessorKey === "ResearcherId") {
                                return <TextField
                                    key={column.accessorKey}
                                    label={column.header}
                                    name={column.accessorKey}
                                    disabled
                                    defaultValue={column.accessorKey && currentMemberTeam[column.accessorKey]}
                                />
                            }
                            else if (column.accessorKey === "Gender") {
                                return <FormControl sx={{ m: 0, minWidth: 120 }}>
                                    <InputLabel id="edit-select-required" key="input-edit-gender">Giới tính</InputLabel>
                                    <Select
                                        key="select-edit-gender"
                                        labelId="edit-select-required"
                                        id="edit-select-required"
                                        value={Genders[currentMemberTeam.Gender].toString()}
                                        label="Giới tính"
                                        onChange={(e: SelectChangeEvent) =>
                                            dispatch(setCurrentMemberTeam({ 
                                                ...currentMemberTeam,
                                                "Gender": Genders[Number(e.target.value)] as keyof typeof Genders 
                                            }))
                                        }
                                    >
                                        {Object.values(Genders).slice(0, (Object.values(Genders).length + 1) / 2)
                                            .map((x, idx) => <MenuItem key={"UpdateGender" + idx} value={idx}>{x}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            }
                            else if (column.accessorKey === "Title") {
                                return <FormControl sx={{ m: 0, minWidth: 120 }}>
                                    <InputLabel id="edit-select-title-required" key="input-edit-title">Chức vụ</InputLabel>
                                    <Select
                                        key="select-edit-title"
                                        labelId="edit-select-title-required"
                                        id="edit-select-title-required"
                                        value={ResearchTeamTitles[currentMemberTeam.Title].toString()}
                                        label="Chức vụ"
                                        onChange={(e: SelectChangeEvent) =>
                                            dispatch(setCurrentMemberTeam({ 
                                                ...currentMemberTeam, 
                                                "Title": ResearchTeamTitles[Number(e.target.value)] as keyof typeof ResearchTeamTitles 
                                            }))}
                                    >
                                        {Object.values(ResearchTeamTitles).slice(0, (Object.values(ResearchTeamTitles).length + 1) / 2)
                                            .map((x, idx) => <MenuItem key={"UpdateTitle" + idx} value={idx}>{x}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            }
                            else {
                                return <TextField
                                    key={column.accessorKey}
                                    label={column.header}
                                    name={column.accessorKey}
                                    defaultValue={column.accessorKey && currentMemberTeam[column.accessorKey]}
                                    onChange={(e) =>
                                        dispatch(setCurrentMemberTeam({ ...currentMemberTeam, [e.target.name]: e.target.value }))
                                    }
                                />
                            }
                        })}

                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>Hủy</Button>
                <Button color="primary" onClick={handleSubmit} variant="contained">
                    Lưu thay đổi
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(EditMemberTeamModal);
