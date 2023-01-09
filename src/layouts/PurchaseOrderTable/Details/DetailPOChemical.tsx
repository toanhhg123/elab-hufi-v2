import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
    MRT_Cell,
    MRT_ColumnDef,
} from 'material-react-table';
import {
    Button,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { IOrderChemicalType } from '../../../types/purchaseOrderType';
import moment from 'moment';
import { Add, Delete, Edit } from '@mui/icons-material';

const DetailPOChemical: FC<{
    handleOpenCreateModal: any;
    handleOpenEditModal: any;
    handleOpenDeleteModal: any;
}> = ({
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenDeleteModal
}) => {
        const currentPurchaseOrder = useAppSelector((state: RootState) => state.purchaseOrder.currentPurchaseOrder);

        const [tableData, setTableData] = useState<any>([]);

        useEffect(() => {
            let formatedData = currentPurchaseOrder.listChemDetail.map((item) => {
                return {
                    ...item,
                    "formatedManufacturingDate": moment.unix(item.ManufacturingDate).format('DD/MM/YYYY'),
                    "formatedExpiryDate": moment.unix(item.ExpiryDate).format('DD/MM/YYYY'),
                }
            })
            setTableData(formatedData);
        }, [currentPurchaseOrder])

        const [validationErrors, setValidationErrors] = useState<{
            [cellId: string]: string;
        }>({});

        const getCommonEditTextFieldProps = useCallback(
            (
                cell: MRT_Cell<IOrderChemicalType>,
            ): MRT_ColumnDef<IOrderChemicalType>['muiTableBodyCellEditTextFieldProps'] => {
                return {
                    error: !!validationErrors[cell.id],
                    helperText: validationErrors[cell.id],
                };
            },
            [validationErrors],
        );

        const columns = useMemo<MRT_ColumnDef<IOrderChemicalType>[]>(
            () => [
                {
                    accessorKey: 'ChemDetailId',
                    header: 'Mã nhập',
                },
                {
                    accessorKey: 'ChemicalId',
                    header: 'Mã hoá chất',
                },
                {
                    accessorKey: 'ChemicalName',
                    header: 'Tên hoá chất',
                },
                {
                    accessorKey: 'AmountOriginal',
                    header: 'SL nhập',
                },
                {
                    accessorKey: 'Unit',
                    header: 'Đơn vị',
                },
                {
                    accessorKey: 'formatedManufacturingDate',
                    header: 'Ngày sản xuất',
                },
                {
                    accessorKey: 'formatedExpiryDate',
                    header: 'Ngày hết hạn',
                },
                {
                    accessorKey: 'LotNumber',
                    header: 'Số lô',
                },
                {
                    accessorKey: 'Price',
                    header: 'Giá',
                },
                {
                    accessorKey: 'ManufacturerName',
                    header: 'Nhà sản xuất',
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
                    <span>Thông tin nhập hoá chất</span>
                </Typography>

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
                    enableTopToolbar={false}
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
                    renderRowActions={({ row, table }) => (
                        <>
                            <Tooltip arrow placement="left" title="Sửa thông tin nhập hoá chất">
                                <IconButton onClick={() => handleOpenEditModal(row)}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Xoá thông tin nhập hoá chất">
                                <IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    renderBottomToolbarCustomActions={() => (
                        <Tooltip title="Tạo thông tin nhập hoá chất mới" placement="right-start">
                            <Button
                                color="primary"
                                onClick={handleOpenCreateModal}
                                variant="contained"
                                style={{ "margin": "10px" }}
                            >
                                <Add fontSize="small" />
                            </Button>
                        </Tooltip>
                    )}
                />
            </>
        );
    };

export default DetailPOChemical;
