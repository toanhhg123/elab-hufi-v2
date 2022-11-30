import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
    Stack,
    TextField,
} from '@mui/material';
import { useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IDevicesBelongingToSubjectType, ISubjectType } from '../../types/subjectType';

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
                            <MaterialReactTable
                                displayColumnDefOptions={{
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
                                enableTopToolbar={false}
                                enableEditing
                                enableColumnOrdering
                                enableRowNumbers
                                enablePinning
                                initialState={{
                                    density: 'compact',
                                    columnOrder: [
                                        'mrt-row-numbers',
                                        ...columns.map(x => x.accessorKey ? x.accessorKey.toString() : ''),
                                    ]
                                }}
                                muiTableBodyCellEditTextFieldProps={({ cell }) => ({
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
                    <Button onClick={onClose}>Đóng</Button>
                    {/* <Button color="primary" onClick={() => handleSubmit(tableData)} variant="contained">
                        Lưu thay đổi
                    </Button> */}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DevicePlanning;
