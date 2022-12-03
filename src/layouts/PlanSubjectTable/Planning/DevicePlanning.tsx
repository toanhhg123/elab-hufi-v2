import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
    MRT_Cell,
    MRT_ColumnDef,
} from 'material-react-table';
import {
    Typography,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IDevicesBelongingToPlanSubjectType, IPlanSubjectType } from '../../../types/planSubjectType';

const DevicePlanning: FC<{
    isOpen: boolean,
    currentValue: IDevicesBelongingToPlanSubjectType[],
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

export default DevicePlanning;
