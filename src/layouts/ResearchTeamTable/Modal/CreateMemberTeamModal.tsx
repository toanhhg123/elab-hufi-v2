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

const CreateMemberTeamModal: FC<{
    isOpen: boolean;
    columns: MRT_ColumnDef<IListMemberType>[];
    onClose: any;
    handleSubmit: any;
}> = ({ isOpen, columns, onClose, handleSubmit }) => {
    const { currentMemberTeam } = useAppSelector((state: RootState) => state.researchTeam);
    const dispatch = useAppDispatch();

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
                            else if (column.accessorKey === "Gender") {
                                return <FormControl sx={{ m: 0, minWidth: 120 }}>
                                    <InputLabel id="create-select-required" key="create-input-gender">Giới tính</InputLabel>
                                    <Select
                                        key="create-select-gender"
                                        labelId="create-select-required"
                                        id="create-select-required"
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
                                        value={ResearchTeamTitles[currentMemberTeam.Title].toString()}
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
                            else {
                                return <TextField
                                    key={"create" + column.accessorKey}
                                    label={column.header}
                                    name={column.accessorKey}
                                    defaultValue={column.accessorKey && currentMemberTeam[column.accessorKey]}
                                    onChange={(e) =>
                                        dispatch(setCurrentMemberTeam({ ...currentMemberTeam, [e.target.name]: e.target.value }))
                                    }
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
