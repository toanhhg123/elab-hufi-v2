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
    Tooltip,
    IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IDevicesBelongingToLessonLab, ILessonLabType } from '../../types/lessonLabType';
import Autocomplete from '@mui/material/Autocomplete';
import { IDeviceType } from '../../types/deviceType';

const DevicePlanning: FC<{
    isOpen: boolean,
    currentLessonLab: ILessonLabType,
    defaultCurrentValue: IDevicesBelongingToLessonLab[],
    onClose: () => void,
    handleSubmit: (DevicePlanningData: any) => void,
}> = ({ isOpen, currentLessonLab, onClose, handleSubmit, defaultCurrentValue }) => {
    const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
    const [tableData, setTableData] = useState<any[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    useEffect(() => {
        if (isOpen && currentLessonLab?.LessonId) {
            let temp = defaultCurrentValue.map(item => { return { ...item } });
            setTableData(temp);
        }

        return () => {
            if (!isOpen) {
                setTableData([]);
            }
        }
    }, [isOpen, currentLessonLab])

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<ILessonLabType>,
        ): MRT_ColumnDef<ILessonLabType>['muiTableBodyCellEditTextFieldProps'] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
            };
        },
        [validationErrors],
    );

    const handleSaveCell = (cell: MRT_Cell<any>, value: any) => {
        //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here
        let updatedData = [...tableData];
        if (tableData[cell.row.index].hasOwnProperty(cell.column.id)) {
            updatedData[cell.row.index][cell.column.id as keyof any] = value;
        } else {
            updatedData = tableData.map((item, idx) => {
                if (idx === Number(cell.row.index)) {
                    return {
                        ...item,
                        [cell.column.id]: value
                    }
                } else {
                    return item;
                }
            })
        }
        //send/receive api updates here
        setTableData([...updatedData]); //re-render with new data
    };

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'DeviceId',
                header: 'Mã dụng cụ',
                enableEditing: false,
            },
            {
                accessorKey: 'DeviceName',
                header: 'Tên dụng cụ',
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

    const handleDeletePlanning = (row: any) => {
        let updatedData = [...tableData];
        updatedData.splice(Number(row.id), 1);
        setTableData([...updatedData]);
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
                <DialogTitle textAlign="center"><b>Dự trù dụng cụ cho bài thí nghiệm</b></DialogTitle>
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
                                key={"LessonName"}
                                label={"Tên bài thí nghiệm"}
                                name={"LessonName"}
                                defaultValue={currentLessonLab.LessonName}
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
                                disableClearable
                                renderTags={(value: readonly IDeviceType[], getTagProps) =>
                                    value.map((option: IDeviceType, index: number) => (
                                        <></>
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="Chọn dụng cụ..." variant="standard" />
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
                                editingMode="cell"
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
                                        <span>Thông tin dụng cụ</span>
                                    </h3>
                                )}
                                renderRowActions={({ row, table }) => (
                                    <Tooltip arrow placement="right" title="Xoá">
                                        <IconButton color="error" onClick={() => handleDeletePlanning(row)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            />
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button color="primary" onClick={() => handleSubmit(tableData)} variant="contained">
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DevicePlanning;
