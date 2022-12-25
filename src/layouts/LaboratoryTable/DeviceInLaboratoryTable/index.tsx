import React, { FC, useEffect, useMemo, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import {
    debounce,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { Box } from '@mui/system';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import moment from 'moment';
import { MRT_Cell, MRT_ColumnDef, MRT_Row } from 'material-react-table';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { ILaboratoryType, IListDeviceBelongingToLaboratoryType } from '../../../types/laboratoryType';
import { dummyDeviceData, IDeviceSpecType } from '../../../types/deviceType';
import DeviceSpecDialog from './DeviceSpecDialog';
import { ColumnType, descendingComparator, removeAccents, renderArrowSort } from '../Utils';

const StyledTableCell = styled(TableCell)(theme => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'lightgray',
    },
}));

type ListDeviceBelongingToLaboratoryType = IListDeviceBelongingToLaboratoryType | undefined;

type DeviceInLaboratoryTableProps = {
    deviceData: IListDeviceBelongingToLaboratoryType[];
    columns: ColumnType[];
    row: MRT_Row<ILaboratoryType>
};

const DeviceInLaboratoryTable: FC<DeviceInLaboratoryTableProps> = ({ deviceData, columns }) => {
    const deviceSpecData = useAppSelector((state: RootState) => state.device.listOfDeviceSpecs);
    const [isDetailModal, setIsDetailModal] = useState(false);
    const [tableData, setTableData] = useState<IListDeviceBelongingToLaboratoryType[]>(deviceData);
    const [order, setOrder] = useState<string>('asc');
    const [orderBy, setOrderBy] = useState<string>('DeviceDeptId');
    const [keyword, setKeyword] = useState<string>('');
    const [dataSearch, setDataSearch] = useState<any>([]);
    const [selectedRow, setSelectedRow] = useState<any>(dummyDeviceData);
    const [deviceSpecTableData, setDeviceSpecTableData] = useState<IDeviceSpecType[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({})

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<IListDeviceBelongingToLaboratoryType>,
        ): MRT_ColumnDef<IListDeviceBelongingToLaboratoryType>['muiTableBodyCellEditTextFieldProps'] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
            };
        },
        [validationErrors],
    );

    const deviceSpecColumns = useMemo<MRT_ColumnDef<IDeviceSpecType>[]>(
        () => [
            {
                accessorKey: 'SpecsID',
                header: 'Id thông số',
                size: 100,
            },
            {
                accessorKey: 'SpecsName',
                header: 'Tên thông số',
                size: 100,
            },
            {
                accessorKey: 'SpecsValue',
                header: 'Giá trị',
                size: 100,
            },
        ],
        [getCommonEditTextFieldProps],
    );

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
        setTableData(prev => {
            let data = [...prev];
            data?.sort((a: ListDeviceBelongingToLaboratoryType, b: ListDeviceBelongingToLaboratoryType) => {
                let i =
                    order === 'desc'
                        ? descendingComparator<any>(a, b, orderBy)
                        : -descendingComparator<any>(a, b, orderBy);
                return i;
            });
            return data;
        });
    }, [order, orderBy]);

    useEffect(() => {
        const deviceItems: IListDeviceBelongingToLaboratoryType[] = deviceData || [];
        const data = deviceItems?.map((x: IListDeviceBelongingToLaboratoryType) => {
            let string: String = '';

            Object.keys(x).forEach(key => {
                if (typeof x[key as keyof typeof x] === 'string') string += x[key as keyof typeof x] + ' ';
                if (typeof x[key as keyof typeof x] === 'number') string += x[key as keyof typeof x]?.toString() + ' ';
            });

            return {
                label: removeAccents(string.toUpperCase()),
                id: x?.DeviceDeptId,
            };
        });
        setDataSearch(data);
    }, []);

    useEffect(() => {
        const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);
        const deviceItems: IListDeviceBelongingToLaboratoryType[] = deviceData || [];

        if (keyword === '') {
            setTableData(deviceItems);
        } else {
            const data = deviceItems?.filter((x: any) => listId.indexOf(x?.DeviceDeptId) !== -1);
            setTableData(data);
        }
    }, [keyword, dataSearch]);

    useEffect(() => {
        if (selectedRow.DeviceDeptId) {
            let idx = selectedRow.DeviceDeptId.split('_');
            let formatedDeviceSpecData = deviceSpecData.filter(x => x.DeviceId === idx[0]);
            setDeviceSpecTableData(formatedDeviceSpecData);
        }

    }, [selectedRow, deviceSpecData])

    const handleOpenDetailModal = (index: number) => {
        setSelectedRow(deviceData[index]);
        setIsDetailModal(true);
    }

    const onCloseDetailModal = () => {
        setSelectedRow(dummyDeviceData);
        setIsDetailModal(false);
    }

    return (
        <>
            <Box component="div" alignItems="center" justifyContent="space-between" display="flex" mb={2}>
                <Typography fontWeight="bold">Bảng thiết bị</Typography>
                <Box display="flex" alignItems="end">
                    <TextField
                        id="filled-search"
                        type="search"
                        variant="standard"
                        placeholder="Tìm kiếm..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={debounce(e => setKeyword(removeAccents(e.target.value.toUpperCase())), 300)}
                    />
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: '400px', marginBottom: '24px', overflow: 'overlay' }}>
                <Table sx={{ minWidth: 650 }} stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">
                                <b>#</b>
                            </StyledTableCell>
                            {columns.map(col => {
                                return (
                                    <StyledTableCell
                                        align="left"
                                        key={col.id}
                                        onClick={() => handleRequestSort(col.id)}
                                    >
                                        <b>{col.header}</b>
                                        {renderArrowSort(order, orderBy, col.id)}
                                    </StyledTableCell>
                                );
                            })}
                            <StyledTableCell align="right">
                                <b>Hành động</b>
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.length > 0 ? tableData?.map((deviceItem: IListDeviceBelongingToLaboratoryType, index: number) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="left">{index + 1}</TableCell>
                                {columns.map(col => {
                                    if (col.renderValue) {
                                        return (
                                            <TableCell align="left" key={col.id}>
                                                {`${col.renderValue(
                                                    `${deviceItem[col.id as keyof typeof deviceItem]}`
                                                )}`}
                                            </TableCell>
                                        );
                                    }
                                    if (col.type === 'date')
                                        return (
                                            <TableCell align="left" key={col.id}>
                                                {moment
                                                    .unix(Number(deviceItem[col.id as keyof typeof deviceItem]))
                                                    .format('DD/MM/YYYY')}
                                            </TableCell>
                                        );

                                    return (
                                        <TableCell align="left" key={col.id}>
                                            {deviceItem[col.id as keyof typeof deviceItem]
                                                ? `${deviceItem[col.id as keyof typeof deviceItem]}`
                                                : ''}
                                        </TableCell>
                                    );
                                })}
                                <TableCell align="right" size="small">
                                    <Tooltip arrow placement="left" title="Xem chi tiết">
                                        <IconButton onClick={() => handleOpenDetailModal(index)}>
                                            <RemoveRedEyeIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                            :
                            <TableRow>
                                <TableCell colSpan={12} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" gutterBottom align="center" component="div">
                                        Trống
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <DeviceSpecDialog
                isOpen={isDetailModal}
                columns={columns}
                deviceSpecColumns={deviceSpecColumns}
                onClose={onCloseDetailModal}
                selectedDeivce={selectedRow}
                deviceSpecData={deviceSpecTableData}
            />
        </>
    );
};

export default React.memo(DeviceInLaboratoryTable);
