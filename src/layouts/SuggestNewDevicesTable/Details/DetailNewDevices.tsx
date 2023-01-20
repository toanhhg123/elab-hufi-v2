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
import { IOrderDeviceType } from '../../../types/purchaseOrderType';
import { Add, Delete, Edit } from '@mui/icons-material';
import { IListDeviceInSuggestNewDeviceType } from '../../../types/suggestNewDeviceType';

const DetailNewDevices: FC<{
    handleOpenCreateModal: any;
    handleOpenEditModal: any;
    handleOpenDeleteModal: any;
}> = ({
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenDeleteModal
}) => {
        const currentSuggestNewDeviceForm = useAppSelector((state: RootState) => state.suggestNewDevice.currentSuggestNewDeviceForm);

        const [tableData, setTableData] = useState<any>([]);

        useEffect(() => {
            // let formatedData = currentPurchaseOrder.listDevDetail.map((item) => {
            //     return {
            //         ...item,
            //         "formatedManufacturingDate": moment.unix(item.ManufacturingDate).format('DD/MM/YYYY'),
            //         "formatedExpiryDate": moment.unix(item.ExpiryDate).format('DD/MM/YYYY'),
            //     }
            // })
            setTableData(currentSuggestNewDeviceForm.ListDevice);
        }, [currentSuggestNewDeviceForm])

        const [validationErrors, setValidationErrors] = useState<{
            [cellId: string]: string;
        }>({});

        const getCommonEditTextFieldProps = useCallback(
            (
                cell: MRT_Cell<IOrderDeviceType>,
            ): MRT_ColumnDef<IOrderDeviceType>['muiTableBodyCellEditTextFieldProps'] => {
                return {
                    error: !!validationErrors[cell.id],
                    helperText: validationErrors[cell.id],
                };
            },
            [validationErrors],
        );

        const columns = useMemo<MRT_ColumnDef<IListDeviceInSuggestNewDeviceType>[]>(
            () => [
                {
                    accessorKey: 'SuggestDetailId',
                    header: 'Mã đề nghị chi tiết',
                },
                {
                    accessorKey: 'DeviceId',
                    header: 'Mã thiết bị',
                },
                {
                    accessorKey: 'DeviceName',
                    header: 'Tên thiết bị',
                },
                {
                    accessorKey: 'QuantityAvailable',
                    header: 'SL có sẵn',
                },
                {
                    accessorKey: 'Quantitysuggest',
                    header: 'SL đề nghị',
                },
                {
                    accessorKey: 'Price',
                    header: 'Giá',
                },
                {
                    accessorKey: 'NewStandard',
                    header: 'Qui cách',
                },
                {
                    accessorKey: 'ExplainUsage',
                    header: 'Mục đích SD',
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
                    <span>Chi tiết thiết bị</span>
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
                            <Tooltip arrow placement="left" title="Sửa thông tin đề xuất thiết bị">
                                <IconButton onClick={() => handleOpenEditModal(row)}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Xoá thông tin đề xuất thiết bị">
                                <IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    renderBottomToolbarCustomActions={() => (
                        <Tooltip title="Tạo thông tin đề xuất thiết bị mới" placement="right-start">
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

export default DetailNewDevices;
