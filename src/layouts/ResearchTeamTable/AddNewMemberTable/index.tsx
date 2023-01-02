import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MaterialReactTable, {
    MRT_Cell,
    MRT_ColumnDef,
} from 'material-react-table';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { dummyListMemberData, IListMemberType } from '../../../types/researchTeamType';
import { Genders, ResearchTeamTitles } from '../../../configs/enums';
import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const AddNewMemberTable: FC<{
    currentResearchTeam: any;
    setCurrentResearchTeam: any;
    setIsResearchTeamDialog: any;
}> = ({ currentResearchTeam, setCurrentResearchTeam }) => {
    const [isCreateModal, setIsCreateModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState<boolean>(false);
    const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
    const [tableData, setTableData] = useState<IListMemberType[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const [updatedRow, setUpdatedRow] = useState<any>(dummyListMemberData);
    const [deletedRow, setDeletedRow] = useState<any>(dummyListMemberData);
    const [createdRow, setCreatedRow] = useState<any>(dummyListMemberData);

    useEffect(() => {
        if (currentResearchTeam.listMember.length > 0) {
            setTableData(currentResearchTeam.listMember);
        }
    }, [currentResearchTeam])


    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<IListMemberType>,
        ): MRT_ColumnDef<IListMemberType>['muiTableBodyCellEditTextFieldProps'] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
            };
        },
        [validationErrors],
    );

    const columns = useMemo<MRT_ColumnDef<IListMemberType>[]>(
        () => [
            {
                accessorKey: 'Title',
                header: 'Chức vụ',
            },
            {
                accessorKey: 'ResearcherId',
                header: 'Mã nghiên cứu viên',
            },
            {
                accessorKey: 'Fullname',
                header: 'Họ và tên',
            },
            {
                accessorKey: 'formatedBirthday',
                header: 'Ngày sinh',
                type: 'date'
            },
            {
                accessorKey: 'Gender',
                header: 'Giới tính',
            },
            {
                accessorKey: 'Address',
                header: 'Địa chỉ',
            },
            {
                accessorKey: 'Email',
                header: 'Email',
            },
            {
                accessorKey: 'PhoneNumber',
                header: 'SĐT',
            },
            {
                accessorKey: 'Organization',
                header: 'Tổ chức',
            },
        ],
        [getCommonEditTextFieldProps],
    );

    const handleOpenEditModal = (row: any) => {
        setUpdatedRow(row.original);
        setIsEditModal(true);
    }

    const onCloseEditModal = () => {
        setUpdatedRow(dummyListMemberData);
        setIsEditModal(false);
    }

    const handleSubmitEditModal = async () => {
        let updatedIdx = currentResearchTeam.listMember.findIndex((item: IListMemberType) => item.ResearcherId === updatedRow.ResearcherId);
        setCurrentResearchTeam({
            ...currentResearchTeam,
            listMember: [...currentResearchTeam.listMember.slice(0, updatedIdx), updatedRow, ...currentResearchTeam.listMember.slice(updatedIdx + 1,)]
        })
        onCloseEditModal();
    }

    const handleOpenDeleteModal = (row: any) => {
        setDeletedRow(row.original);
        setIsDeleteModal(true);
    }

    const onCloseDeleteModal = () => {
        setDeletedRow(dummyListMemberData);
        setIsDeleteModal(false);
    }

    const handleSubmitDeleteModal = () => {
        let deletedIdx = currentResearchTeam.listMember.findIndex((item: IListMemberType) => item.ResearcherId === deletedRow.ResearcherId);
        setCurrentResearchTeam({
            ...currentResearchTeam,
            listMember: [...currentResearchTeam.listMember.slice(0, deletedIdx), ...currentResearchTeam.listMember.slice(deletedIdx + 1,)]
        })

        onCloseDeleteModal();
    }

    const handleOpenCreateModal = (row: any) => {
        setIsCreateModal(true);
    }

    const onCloseCreateModal = () => {
        setCreatedRow(dummyListMemberData);
        setIsCreateModal(false);
    }

    const handleSubmitCreateModal = async () => {
        setCurrentResearchTeam({
            ...currentResearchTeam,
            listMember: [...currentResearchTeam.listMember, createdRow]

        })
        onCloseCreateModal();
    }

    return (
        <>
            <MaterialReactTable
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        header: 'Các hành động',
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        muiTableBodyCellProps: {
                            align: 'center',
                        },
                    },
                    'mrt-row-numbers': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        muiTableBodyCellProps: {
                            align: 'center',
                        },
                    }
                }}
                columns={columns}
                data={tableData}
                editingMode="modal" //default
                enableColumnOrdering
                enableEditing
                enableRowNumbers
                enablePinning
                initialState={{
                    density: 'compact',
                    columnOrder: [
                        'mrt-row-expand',
                        'mrt-row-numbers',
                        ...columns.map(x => x.accessorKey || ''),
                        'mrt-row-actions'
                    ]
                }}
                renderRowActions={({ row, table }) => (
                    <>
                        <Tooltip arrow placement="left" title="Sửa thông tin thành viên">
                            <IconButton onClick={() => handleOpenEditModal(row)}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Xoá thông tin thành viên">
                            <IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
                renderTopToolbarCustomActions={() => (
                    <h3 style={{ "margin": "0px" }}>
                        <b><KeyboardArrowRightIcon
                            style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
                        ></KeyboardArrowRightIcon></b>
                        <span>Thông tin thành viên</span>
                    </h3>
                )}
                renderBottomToolbarCustomActions={() => (
                    <Tooltip title="Thêm thành viên mới" placement="right-start">
                        <Button
                            color="primary"
                            onClick={handleOpenCreateModal}
                            variant="contained"
                            style={{ "margin": "10px" }}
                        >
                            <AddIcon fontSize="small" />
                        </Button>
                    </Tooltip>
                )}
            />

            <Dialog open={isEditModal}>
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
                                            value={new Date(updatedRow.Birthday * 1000)}
                                            onChange={(val: any) =>
                                                setUpdatedRow({
                                                    ...updatedRow,
                                                    "formatedBirthday": moment.unix(Date.parse(val) / 1000).format('DD/MM/YYYY'),
                                                    "Birthday": Date.parse(val) / 1000
                                                })
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
                                        defaultValue={column.accessorKey && updatedRow[column.accessorKey]}
                                    />
                                }
                                else if (column.accessorKey === "Gender") {
                                    return <FormControl sx={{ m: 0, minWidth: 120 }}>
                                        <InputLabel id="edit-select-required">Giới tính</InputLabel>
                                        <Select
                                            labelId="edit-select-required"
                                            id="edit-select-required"
                                            value={Genders[updatedRow.Gender]}
                                            label="Giới tính"
                                            onChange={(e: SelectChangeEvent) =>
                                                setUpdatedRow({ ...updatedRow, "Gender": Genders[Number(e.target.value)] })}
                                        >
                                            {Object.values(Genders).slice(0, (Object.values(Genders).length + 1) / 2)
                                                .map((x, idx) => <MenuItem key={"UpdateGender" + idx} value={idx}>{x}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                }
                                else if (column.accessorKey === "Title") {
                                    return <FormControl sx={{ m: 0, minWidth: 120 }}>
                                        <InputLabel id="edit-select-title-required">Chức vụ</InputLabel>
                                        <Select
                                            labelId="edit-select-title-required"
                                            id="edit-select-title-required"
                                            value={ResearchTeamTitles[updatedRow.Title]}
                                            label="Chức vụ"
                                            onChange={(e: SelectChangeEvent) =>
                                                setUpdatedRow({ ...updatedRow, "Title": ResearchTeamTitles[Number(e.target.value)] })}
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
                                        defaultValue={column.accessorKey && updatedRow[column.accessorKey]}
                                        onChange={(e) =>
                                            setUpdatedRow({ ...updatedRow, [e.target.name]: e.target.value })
                                        }
                                    />
                                }
                            })}

                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={onCloseEditModal}>Hủy</Button>
                    <Button color="primary" onClick={handleSubmitEditModal} variant="contained">
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeleteModal}>
                <DialogTitle textAlign="center"><b>Xoá thông tin thành viên</b></DialogTitle>
                <DialogContent>
                    <div>Bạn có chắc muốn xoá thông tin thành viên {`${deletedRow.ResearcherId}`} không?</div>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={onCloseDeleteModal}>Hủy</Button>
                    <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isCreateModal}>
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
                                            value={new Date(createdRow.Birthday * 1000)}
                                            onChange={(val: any) =>
                                                setCreatedRow({
                                                    ...createdRow,
                                                    "formatedBirthday": moment.unix(Date.parse(val) / 1000).format('DD/MM/YYYY'),
                                                    "Birthday": Date.parse(val) / 1000
                                                })
                                            }
                                            renderInput={(params: any) => <TextField key={"CreateBirthdayTextField"} {...params} />}
                                            inputFormat='DD/MM/YYYY'
                                        />
                                    </LocalizationProvider>
                                }
                                else if (column.accessorKey === "Gender") {
                                    return <FormControl sx={{ m: 0, minWidth: 120 }}>
                                        <InputLabel id="create-select-required">Giới tính</InputLabel>
                                        <Select
                                            labelId="create-select-required"
                                            id="create-select-required"
                                            value={Genders[createdRow.Gender]}
                                            label="Giới tính"
                                            onChange={(e: SelectChangeEvent) =>
                                                setCreatedRow({ ...createdRow, "Gender": Genders[Number(e.target.value)] })}
                                        >
                                            {Object.values(Genders).slice(0, (Object.values(Genders).length + 1) / 2)
                                                .map((x, idx) => <MenuItem key={"CreateGender" + idx} value={idx}>{x}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                }
                                else if (column.accessorKey === "Title") {
                                    return <FormControl sx={{ m: 0, minWidth: 120 }}>
                                        <InputLabel id="create-select-title-required">Chức vụ</InputLabel>
                                        <Select
                                            labelId="create-select-title-required"
                                            id="create-select-title-required"
                                            value={ResearchTeamTitles[createdRow.Title]}
                                            label="Chức vụ"
                                            onChange={(e: SelectChangeEvent) =>
                                                setCreatedRow({ ...createdRow, "Title": ResearchTeamTitles[Number(e.target.value)] })}
                                        >
                                            {Object.values(ResearchTeamTitles).slice(0, (Object.values(ResearchTeamTitles).length + 1) / 2)
                                                .map((x, idx) => <MenuItem key={"CreateTitle" + idx} value={idx}>{x}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                }
                                else {
                                    return <TextField
                                        key={column.accessorKey}
                                        label={column.header}
                                        name={column.accessorKey}
                                        defaultValue={column.accessorKey && updatedRow[column.accessorKey]}
                                        onChange={(e) =>
                                            setCreatedRow({ ...createdRow, [e.target.name]: e.target.value })
                                        }
                                    />
                                }
                            }
                            )}

                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={onCloseCreateModal}>Hủy</Button>
                    <Button color="primary" onClick={handleSubmitCreateModal} variant="contained">
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default React.memo(AddNewMemberTable);
