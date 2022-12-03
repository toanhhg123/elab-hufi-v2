import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
    MRT_Cell,
    MRT_ColumnDef,
} from 'material-react-table';
import {
    Typography,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IInstrumentBelongingToPlanSubjectType, IPlanSubjectType } from '../../../types/planSubjectType';

const InstrumentPlanning: FC<{
    isOpen: boolean,
    currentValue: IInstrumentBelongingToPlanSubjectType[],
}> = ({ isOpen, currentValue }) => {
    const [tableData, setTableData] = useState<any[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    useEffect(() => {
        if (isOpen) {
            setTableData(currentValue);
        }

        return () => {
            if (!isOpen) {
                setTableData([]);
            }
        }
    }, [isOpen])

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<IPlanSubjectType>,
        ): MRT_ColumnDef<IPlanSubjectType>['muiTableBodyCellEditTextFieldProps'] => {
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
                accessorKey: 'InstrumentId',
                header: 'Mã dụng cụ',
                enableEditing: false,
            },
            {
                accessorKey: 'InstrumentName',
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

    return (
        <>
         <Typography noWrap component="div">
                <b><KeyboardArrowRightIcon
                    style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
                ></KeyboardArrowRightIcon></b>
                <span>Bảng dự trù thiết bị</span>
            </Typography>

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
            />
        </>
    );
};

export default InstrumentPlanning;
