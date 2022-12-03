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
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IChemicalsBelongingToSubjectType, ISubjectType } from '../../types/subjectType';

const ChemicalPlanning: FC<{
    isOpen: boolean,
    currentSubject: ISubjectType,
    defaultCurrentValue: IChemicalsBelongingToSubjectType[],
    onClose: () => void,
    handleSubmit: (ChemicalPlanningData: any) => void,
}> = ({ isOpen, currentSubject, onClose, handleSubmit, defaultCurrentValue }) => {
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

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'ChemicalId',
                header: 'Mã hóa chất',
                enableEditing: false,
            },
            {
                accessorKey: 'ChemicalName',
                header: 'Tên hoá chất',
                enableEditing: false,
            },
            {
                accessorKey: 'Specifications',
                header: 'CTHH',
                enableEditing: false,
            },
            {
                accessorKey: 'Amount',
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
                }}
            >
                <DialogTitle textAlign="center"><b>Dự trù hoá chất cho môn học</b></DialogTitle>
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
                    <Button onClick={onClose}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ChemicalPlanning;
