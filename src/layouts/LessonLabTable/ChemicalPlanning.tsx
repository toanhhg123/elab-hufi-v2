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
import { ILessonLabType } from '../../types/lessonLabType';
import Autocomplete from '@mui/material/Autocomplete';
import { IChemicalType } from '../../types/chemicalType';

const ChemicalPlanning: FC<{
    isOpen: boolean,
    currentLessonLab: ILessonLabType,
    defaultCurrentValue: IChemicalType[],
    onClose: () => void,
    handleSubmit: (ChemicalPlanningData: any) => void,
}> = ({ isOpen, currentLessonLab, onClose, handleSubmit, defaultCurrentValue }) => {
    const chemicalData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
    const [tableData, setTableData] = useState<any[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    useEffect(() => {
        if (isOpen && currentLessonLab?.LessonId) {
            setTableData(defaultCurrentValue);
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
        tableData[cell.row.index][cell.column.id as keyof any] = value;
        //send/receive api updates here
        setTableData([...tableData]); //re-render with new data
    };

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'ChemicalName',
                header: 'Tên hoá chất',
                enableEditing: false,
                size: 100,
            },

            {
                accessorKey: 'Amount',
                header: 'Số lượng',
                size: 100,
            },

        ],
        [getCommonEditTextFieldProps],
    );

    const handleSelectAutocomplete = (e: any, val: IChemicalType[]) => {
        setTableData(val);
    }

    const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
            //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.

            //send/receive api updates here
            setTableData([...tableData]);
            exitEditingMode(); //required to exit editing mode
        };

    return (
        <>
            <Dialog open={isOpen}>
                <DialogTitle textAlign="center"><b>Dự trù hoá chất cho bài thí nghiệm</b></DialogTitle>
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
                                options={chemicalData}
                                value={tableData}
                                isOptionEqualToValue={(option, value) => option.ChemicalId === value.ChemicalId}
                                getOptionLabel={(option: IChemicalType) => option?.ChemicalName ? option.ChemicalName.toString() : ''}
                                id="auto-complete"
                                autoComplete
                                includeInputInList
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="Chọn hoá chất..." variant="standard" />
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
                                        <span>Thông tin hoá chất</span>
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

export default ChemicalPlanning;
