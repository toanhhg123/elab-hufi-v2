import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
    MaterialReactTableProps,
    MRT_Cell,
    MRT_ColumnDef,
} from 'material-react-table';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { setSnackbarMessage } from '../../pages/appSlice';
import { IDevicesBelongingToSubjectType, ISubjectType } from '../../types/subjectType';
import Autocomplete from '@mui/material/Autocomplete';
import { IDeviceType } from '../../types/deviceType';

const DevicePlanning: FC<{
    isOpen: boolean,
    currentSubject: ISubjectType,
    defaultCurrentValue: IDevicesBelongingToSubjectType[],
    onClose: () => void,
    handleSubmit: (DevicePlanningData: any) => void,
}> = ({ isOpen, currentSubject, onClose, handleSubmit, defaultCurrentValue }) => {
    const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
    const [tableData, setTableData] = useState<any[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    useEffect(() => {
        if (isOpen && currentSubject?.SubjectId) {
            setTableData(defaultCurrentValue);
        }

        return () => {
            if (!isOpen) {
                setTableData([]);
            }
        }
    }, [isOpen, currentSubject])

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<ISubjectType>,
        ): MRT_ColumnDef<ISubjectType>['muiTableBodyCellEditTextFieldProps'] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
            };
        },
        [validationErrors],
    );

    const handleSaveCell = (cell: MRT_Cell<any>, value: any) => {
        //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here
        tableData[cell.row.index][cell.column.id as keyof any] = value;
        //send/receive api updates here
        setTableData([...tableData]); //re-render with new data
    };

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'DeviceId',
                header: 'Mã thiết bị',
                enableEditing: false,
            },
            {
                accessorKey: 'DeviceName',
                header: 'Tên thiết bị',
                enableEditing: false,
            },
            {
                accessorKey: 'Standard',
                header: 'Tiêu chuẩn',
                enableEditing: false,
            },
            {
                accessorKey: 'Quantity',
                header: 'Số lượng',
            },
            {
                accessorKey: 'Unit',
                header: 'Đơn vị',
            },
            {
                accessorKey: 'Note',
                header: 'Ghi chú',
            },
        ],
        [getCommonEditTextFieldProps],
    );

    const handleSelectAutocomplete = (e: any, val: IDeviceType[]) => {
        setTableData(val);
    }

    const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
            let updatedData = [...tableData];
            updatedData.splice(Number(row.id), 1, values);
            //send/receive api updates here
            setTableData([...updatedData]);
            exitEditingMode(); //required to exit editing mode
        };

    return (
        <>
            <Dialog open={isOpen}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "800px",  // Set your width here
                        },
                    },
                }}>
                <DialogTitle textAlign="center"><b>Dự trù thiết bị cho môn học</b></DialogTitle>
                <DialogContent>
                    <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
                        <Stack
                            sx={{
                                width: '100%',
                                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                                gap: '1.5rem',
                            }}
                        >
                            <TextField
                                key={"SubjectName"}
                                label={"Tên môn học"}
                                name={"SubjectName"}
                                defaultValue={currentSubject.SubjectName}
                                disabled
                            />
                            <Autocomplete
                                multiple
                                filterSelectedOptions
                                options={deviceData}
                                value={tableData}
                                isOptionEqualToValue={(option, value) => option.DeviceId === value.DeviceId}
                                getOptionLabel={(option: IDeviceType) => option?.DeviceName ? option.DeviceId + ' - ' + option.DeviceName.toString() : ''}
                                id="auto-complete"
                                autoComplete
                                includeInputInList
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="Chọn thiết bị..." variant="standard" />
                                )}
                                onChange={(e: any, val) => handleSelectAutocomplete(e, val)}
                            />

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
                                editingMode="row"
                                enableTopToolbar={false}
                                enableEditing
                                enableColumnOrdering
                                enableRowNumbers
                                enablePinning
                                onEditingRowSave={handleSaveRow}
                                initialState={{
                                    density: 'compact',
                                    columnOrder: [
                                        'mrt-row-numbers',
                                        ...columns.map(x => x.accessorKey ? x.accessorKey.toString() : ''),
                                        'mrt-row-actions'
                                    ]
                                }}
                                muiTableBodyCellEditTextFieldProps={({ cell }) => ({
                                    //onBlur is more efficient, but could use onChange instead
                                    onBlur: (event) => {
                                        handleSaveCell(cell, event.target.value);
                                    },
                                })}
                                renderTopToolbarCustomActions={() => (
                                    <h3 style={{ "margin": "0px" }}>
                                        <b><KeyboardArrowRightIcon
                                            style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
                                        ></KeyboardArrowRightIcon></b>
                                        <span>Thông tin thiết bị</span>
                                    </h3>
                                )}
                            />
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={onClose}>Huỷ</Button>
                    <Button color="primary" onClick={() => handleSubmit(tableData)} variant="contained">
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DevicePlanning;
