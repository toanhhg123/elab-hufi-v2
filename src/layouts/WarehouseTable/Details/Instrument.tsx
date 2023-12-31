import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SearchIcon from '@mui/icons-material/Search';
import {
	debounce,
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
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { MRT_Row } from 'material-react-table';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { IExportDeviceType } from '../../../types/exportDeviceType';
import { IExportType } from '../../../types/exportType';
import { ColumnType } from './DeviceTable';

const StyledTableCell = styled(TableCell)(theme => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: 'lightgray',
	},
}));

type ExportDeviceType = IExportDeviceType | undefined;

type InstrumentTableProps = {
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

const InstrumentTable = ({ row, warehouseData, columns, type }: InstrumentTableProps) => {
	const [deviceOfExport, setDeviceOfExport] = useState<IExportDeviceType[]>([]);
	const [order, setOrder] = useState<string>('asc');
	const [orderBy, setOrderBy] = useState<string>('ExpDeviceDeptId');
	const [keyword, setKeyword] = useState<string>('');
	const [dataSearch, setDataSearch] = useState<any>([]);

	const getExportDeviceData = useCallback(() => {
		let index = warehouseData.findIndex((x: IExportType) => {
			switch (type) {
				case 'DEP':
					return x.ExportId === row.original.ExportId;
				case 'REG':
					return x.ExpRegGeneralId === row.original.ExpRegGeneralId;
				case 'SUB':
					return x.ExpSubjectId === row.original.ExpSubjectId;
				case 'LAB':
					return x.ExportLabId === row.original.ExportLabId;
				default:
					break;
			}
		});
		if (index !== -1) {
			switch (type) {
				case 'DEP':
					return warehouseData[index].listInstrumentExport || [];
				case 'REG':
					return warehouseData[index].listChemicalExport || [];
				case 'SUB':
					return warehouseData[index].listSub || [];
				case 'LAB':
					return warehouseData[index].listInstrument || [];
				default:
					return [];
			}
		} else {
			return [];
		}
	}, [
		row.original.ExportId,
		row.original.ExpRegGeneralId,
		row.original.ExpSubjectId,
		row.original.ExportLabId,
		warehouseData,
		type,
	]);

	useEffect(() => {
		setDeviceOfExport(getExportDeviceData() || []);
	}, [
		row.original.ExportId,
		row.original.ExpRegGeneralId,
		row.original.ExpSubjectId,
		row.original.ExportLabId,
		type,
		warehouseData,
	]);

	const handleRequestSort = (property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	useEffect(() => {
		setDeviceOfExport(prev => {
			let data = [...prev];
			data?.sort((a: ExportDeviceType, b: ExportDeviceType) => {
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
		const exportDevices: IExportDeviceType[] = getExportDeviceData();
		const data = exportDevices.map((x: any) => {
			let string: String = '';

			Object.keys(x).forEach(key => {
				if (key === 'EndGuarantee' || key === 'StartGuarantee' || key === 'ManufacturingDate')
					string += moment.unix(x[key]).format('DD/MM/YYYY') + ' ';
				if (typeof x[key] === 'string') string += x[key] + ' ';
				if (typeof x[key] === 'number') string += x[key]?.toString() + ' ';
			});
			return { label: removeAccents(string.toUpperCase()), id: x.ExpDeviceDeptId };
		});
		setDataSearch(data);
	}, []);

	useEffect(() => {
		const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);
		const exportDevices: IExportDeviceType[] = getExportDeviceData();

		if (keyword === '') {
			setDeviceOfExport(exportDevices);
		} else {
			const data = exportDevices.filter((x: any) => listId.indexOf(x?.ExpDeviceDeptId) !== -1);
			setDeviceOfExport(data);
		}
	}, [keyword, dataSearch]);

	return (
		<>
			<Box component="div" alignItems="center" justifyContent="space-between" display="flex" mb={2}>
				<Typography fontWeight="bold">Bảng Dụng cụ</Typography>
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
			<TableContainer component={Paper} sx={{ maxHeight: '280px', marginBottom: '24px', overflow: 'overlay' }}>
				<Table sx={{ minWidth: 650 }} stickyHeader size="small">
					<TableHead>
						<TableRow>
							<StyledTableCell align="left">
								<b>#</b>
							</StyledTableCell>

							{columns.map(col => {
								return (
									<StyledTableCell
										key={col.id}
										align="left"
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
						{deviceOfExport?.map((exportDevice: any, index: number) => (
							<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell align="left">{index + 1}</TableCell>
								{columns.map(col => {
									if (col.renderValue) {
										if (
											col.id === 'AmountOriginal' ||
											col.id === 'Amount' ||
											col.id === 'Quantity' ||
											col.id === 'QuantityOriginal'
										)
											return (
												<TableCell align="left" key={col.id}>
													{`${col.renderValue(
														`${exportDevice[col.id as keyof typeof exportDevice]}`,
														exportDevice.Unit,
													)}`}
												</TableCell>
											);
									}

									if (col.type === 'date')
										return (
											<TableCell align="left" key={col.id}>
												{moment
													.unix(Number(exportDevice[col.id as keyof typeof exportDevice]))
													.format('DD/MM/YYYY')}
											</TableCell>
										);

									return (
										<TableCell align="left" key={col.id}>
											{exportDevice[col.id as keyof typeof exportDevice]
												? `${exportDevice[col.id as keyof typeof exportDevice]}`
												: ''}
										</TableCell>
									);
								})}
								{deviceOfExport.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={columns.length + 1}
											sx={{ borderBottom: '0', textAlign: 'center' }}
										>
											<h3 style={{ width: '100%', padding: '16px 0px' }}>Trống</h3>
										</TableCell>
									</TableRow>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default InstrumentTable;
