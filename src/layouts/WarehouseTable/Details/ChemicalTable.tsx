import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SearchIcon from '@mui/icons-material/Search';
import {
	debounce, InputAdornment,
	Paper,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	TextField, Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { MRT_Row } from 'material-react-table';
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { IExportChemicalType } from '../../../types/exportChemicalType';
import { IExportType } from '../../../types/exportType';

const StyledTableCell = styled(TableCell)(theme => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: 'lightgray',
	},
}));

type ExportChemicalType = IExportChemicalType | undefined;

export type ColumnType = {
	id: string;
	header: string;
	renderValue?: (...arg: any[]) => void;
};

type ChemicalTableProps = {
	row: MRT_Row<IExportType>;
	warehouseData: any;
	columns: ColumnType[];
	type: string;
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function renderArrowSort(order: string, orderBy: string, property: string) {
	if (orderBy === property) {
		return order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;
	}
	return null;
}

function removeAccents(str: string) {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D');
}

const ChemicalTable = ({
	row,
	warehouseData,
	columns,
	type,
}: ChemicalTableProps) => {
	const nanufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);
	const [chemicalOfExport, setChemicalOfExport] = useState<IExportChemicalType[]>([]);
	const [order, setOrder] = useState<string>('asc');
	const [orderBy, setOrderBy] = useState<string>('ChemDetailId');
	const [keyword, setKeyword] = useState<string>('');
	const [dataSearch, setDataSearch] = useState<any>([]);

	const getExportChemicalData = useCallback(() => {
		let index = warehouseData.findIndex((x: IExportType) => {
			switch (type) {
				case 'DEP':
					return x.ExportId === row.original.ExportId;
				case 'REG':
					return x.ExpRegGeneralId === row.original.ExpRegGeneralId;
				case 'SUB':
					return x.ExpSubjectId === row.original.ExpSubjectId;
				default:
					break;
			}
		});
		if (index !== -1) {
			switch (type) {
				case 'DEP':
					return warehouseData[index].listChemicalExport;
				case 'REG':
					return warehouseData[index].listChemicalExport;
				case 'SUB':
					return warehouseData[index].listSub;
				default:
					return [];
			}
		} else {
			return [];
		}
	}, [row.original.ExportId, row.original.ExpRegGeneralId, row.original.ExpSubjectId,row.original.ExportLabId, warehouseData]);

	useEffect(() => {
		setChemicalOfExport(getExportChemicalData());
	}, [row.original.ExportId, row.original.ExpRegGeneralId, row.original.ExpSubjectId,row.original.ExportLabId, warehouseData]);

	const handleRequestSort = (property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	useEffect(() => {
		setChemicalOfExport(prev => {
			let data = [...prev];
			data?.sort((a: ExportChemicalType, b: ExportChemicalType) => {
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
		const exportChemicals: IExportChemicalType[] = getExportChemicalData() || [];
		const data = exportChemicals?.map((x: IExportChemicalType) => {
			let string: String = '';

			Object.keys(x).forEach(key => {
				if (typeof x[key as keyof typeof x] === 'string') string += x[key as keyof typeof x] + ' ';
				if (typeof x[key as keyof typeof x] === 'number') string += x[key as keyof typeof x]?.toString() + ' ';
			});

			return {
				label: removeAccents(string.toUpperCase()),
				id: x?.ExpChemDeptId,
			};
		});
		setDataSearch(data);
	}, []);

	useEffect(() => {
		const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);
		const exportChemicals: IExportChemicalType[] = getExportChemicalData() || [];

		if (keyword === '') {
			setChemicalOfExport(exportChemicals);
		} else {
			const data = exportChemicals?.filter((x: any) => listId.indexOf(x?.ExpChemDeptId) !== -1);
			setChemicalOfExport(data);
		}
	}, [keyword, dataSearch]);

	return (
		<>
			<Box component="div" alignItems="center" justifyContent="space-between" display="flex" mb={2}>
				<Typography fontWeight="bold">Bảng hóa chất</Typography>
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
						{chemicalOfExport?.map((exportChemical: IExportChemicalType, index: number) => (
							<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell align="left">{index + 1}</TableCell>
								{columns.map(col => {
									if (col.renderValue) {
										if (col.id === 'AmountOriginal' || col.id === 'Amount')
											return (
												<TableCell align="left" key={col.id}>
													{`${col.renderValue(
														`${exportChemical[col.id as keyof typeof exportChemical]}`,
														exportChemical.Unit,
													)}`}
												</TableCell>
											);
									}

									return (
										<TableCell align="left" key={col.id}>
											{exportChemical[col.id as keyof typeof exportChemical]
												? `${exportChemical[col.id as keyof typeof exportChemical]}`
												: ''}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default ChemicalTable;
