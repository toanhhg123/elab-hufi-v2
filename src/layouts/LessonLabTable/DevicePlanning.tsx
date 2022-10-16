import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
    MaterialReactTableProps,
    MRT_Cell,
    MRT_ColumnDef,
} from 'material-react-table';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    TextareaAutosize,
    FormControl,
    Select,
    SelectChangeEvent,
    InputLabel
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { dummyLaboratoryData, ILaboratoryType } from '../../types/laboratoryType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteLaboratory, getLaboratories, postLaboratory, updateLaboratory } from '../../services/laboratoryServices';
import { RootState } from '../../store';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { setSnackbarMessage } from '../../pages/appSlice';
import { ILessonLabType } from '../../types/lessonLabType';
import Autocomplete from '@mui/material/Autocomplete';
import { dummyDeviceData, IDeviceType } from '../../types/deviceType';

const DevicePlanning: FC<{
    isOpen: boolean,
    currentLessonLab: ILessonLabType,
    onClose: () => void,
    handleSubmit: () => void
}> = ({ isOpen, currentLessonLab, onClose, handleSubmit }) => {
    const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
    const [tableData, setTableData] = useState<any[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

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
                accessorKey: 'DeviceName',
                header: 'Tên thiết bị',
                size: 100,
            },

            {
                accessorKey: 'Quantity',
                header: 'Số lượng',
                size: 100,
            },

        ],
        [getCommonEditTextFieldProps],
    );

    const handleSelectAutocomplete = (e: any, val: IDeviceType[]) => {
        console.log("val val val :", val);
        if (val.length !== tableData.length) {

        }

        let newTableData = val.map(x => {
            return {
                'DeviceName': x.DeviceName,
                'Quantity': 0
            }
        });
        setTableData(newTableData);
    }

    useEffect(() => {
        if (isOpen) {
            setTableData([]);
        }

        return () => {
            if (!isOpen) {
                setTableData([]);
            }
        }
    }, [isOpen])

    const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
      tableData[row.index] = values;
      //send/receive api updates here
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode
    };

    return (
        <>
            <Dialog open={isOpen}>
                <DialogTitle textAlign="center"><b>Dự trù thiết bị cho bài thí nghiệm</b></DialogTitle>
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
                                options={deviceData}
                                multiple
                                getOptionLabel={(option: IDeviceType) => option.DeviceName.toString()}
                                id="auto-complete"
                                autoComplete
                                includeInputInList
                                renderInput={(params) => (
                                    <TextField {...params} label="Chọn thiết bị..." variant="standard" />
                                )}
                                onChange={(e: any, val) => handleSelectAutocomplete(e, val)}
                            />

                            <MaterialReactTable
                                displayColumnDefOptions={{
                                    'mrt-row-actions': {
                                        header: '',
                                        muiTableHeadCellProps: {
                                            align: 'center',
                                        },
                                        size: 120,
                                    },
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
                    <Button color="primary" onClick={handleSubmit} variant="contained">
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DevicePlanning;
