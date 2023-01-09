import React, { FC, useEffect, useState } from 'react';
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
import moment from 'moment';
import { IChemicalsBelongingToPlanSubjectType } from '../../../types/planSubjectType';
import { ColumnType, descendingComparator, removeAccents, renderArrowSort } from '../Utils';

const StyledTableCell = styled(TableCell)(theme => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'lightgray',
    },
}));

type ChemicalInLaboratoryTableProps = {
    chemicalData: IChemicalsBelongingToPlanSubjectType[];
    columns: ColumnType[];
};

const ChemicalInLaboratoryTable: FC<ChemicalInLaboratoryTableProps> = ({ chemicalData, columns }) => {
    const [tableData, setTableData] = useState<IChemicalsBelongingToPlanSubjectType[]>(chemicalData);
    const [order, setOrder] = useState<string>('asc');
    const [orderBy, setOrderBy] = useState<string>('ChemicalDeptId');
    const [keyword, setKeyword] = useState<string>('');
    const [dataSearch, setDataSearch] = useState<any>([]);

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
        setTableData(prev => {
            let data = [...prev];
            data?.sort((a: IChemicalsBelongingToPlanSubjectType, b: IChemicalsBelongingToPlanSubjectType) => {
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
        const chemicalItems: IChemicalsBelongingToPlanSubjectType[] = chemicalData || [];
        const data = chemicalItems?.map((x: IChemicalsBelongingToPlanSubjectType) => {
            let string: String = '';

            Object.keys(x).forEach(key => {
                if (typeof x[key as keyof typeof x] === 'string') string += x[key as keyof typeof x] + ' ';
                if (typeof x[key as keyof typeof x] === 'number') string += x[key as keyof typeof x]?.toString() + ' ';
            });

            return {
                label: removeAccents(string.toUpperCase()),
                id: x?.ChemicalId,
            };
        });
        setDataSearch(data);
    }, []);

    useEffect(() => {
        const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);
        const chemicalItems: IChemicalsBelongingToPlanSubjectType[] = chemicalData || [];

        if (keyword === '') {
            setTableData(chemicalItems);
        } else {
            const data = chemicalItems?.filter((x: any) => listId.indexOf(x?.ChemicalId) !== -1);
            setTableData(data);
        }
    }, [keyword, dataSearch]);


    return (
        <>
            <Box component="div" alignItems="center" justifyContent="space-between" display="flex" mb={2}>
                <Typography fontWeight="bold">Bảng hoá chất</Typography>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.length > 0 ? tableData?.map((chemicalItem: IChemicalsBelongingToPlanSubjectType, index: number) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="left">{index + 1}</TableCell>
                                {columns.map(col => {
                                    if (col.renderValue) {
                                        return (
                                            <TableCell align="left" key={col.id}>
                                                {`${col.renderValue(
                                                    `${chemicalItem[col.id as keyof typeof chemicalItem]}`,
                                                    chemicalItem.Unit
                                                )}`}
                                            </TableCell>
                                        );
                                    }
                                    if (col.type === 'date')
                                        return (
                                            <TableCell align="left" key={col.id}>
                                                {moment
                                                    .unix(Number(chemicalItem[col.id as keyof typeof chemicalItem]))
                                                    .format('DD/MM/YYYY')}
                                            </TableCell>
                                        );

                                    return (
                                        <TableCell align="left" key={col.id}>
                                            {chemicalItem[col.id as keyof typeof chemicalItem]
                                                ? `${chemicalItem[col.id as keyof typeof chemicalItem]}`
                                                : ''}
                                        </TableCell>
                                    );
                                })}
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
        </>
    );
};

export default React.memo(ChemicalInLaboratoryTable);
