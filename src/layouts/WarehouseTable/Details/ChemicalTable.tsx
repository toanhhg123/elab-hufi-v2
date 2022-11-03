import styled from '@emotion/styled';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import {
	Autocomplete,
	Button,
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
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { MRT_Row } from 'material-react-table';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { IChemicalType } from '../../../types/chemicalType';
import { IExportChemicalType } from '../../../types/exportChemicalType';
import { IWarehouseType } from '../../../types/warehouseType';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useCallback, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const StyledTableCell = styled(TableCell)(theme => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: 'lightgray',
	},
}));

type ChemicalTableProps = {
	handleOpenCreate: () => void;
	handleOpenEdit: (exportChemical: any) => void;
	handleOpenDelete: (exportChemical: any) => void;
	row: MRT_Row<IWarehouseType>;
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

const ChemicalTable = ({ handleOpenCreate, handleOpenEdit, handleOpenDelete, row }: ChemicalTableProps) => {
	const exportChemicalData = useAppSelector((state: RootState) => state.exportChemical.listOfExportChemical);
	const chemicalsData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
	const nanufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);
	const [chemicalOfExport, setChemicalOfExport] = useState<any>([]);
	const [order, setOrder] = useState<string>('asc');
	const [orderBy, setOrderBy] = useState<string>('ChemicalId');
	const [keyword, setKeyword] = useState<string>('');
	const [dataSearch, setDataSearch] = useState<any>([]);

	const getExportChemicalData = useCallback(() => {
		return exportChemicalData
			.filter((x: IExportChemicalType) => x.ExportId === row.original.ExportId)
			.map((x: IExportChemicalType) => {
				let chemicalInfoIdx = chemicalsData.findIndex((y: IChemicalType) => y.ChemicalId === x.ChemicalId);
				let manufacturerInfoIdx = nanufacturersData.findIndex(
					m => m.ManufacturerId === chemicalsData[chemicalInfoIdx].ManufacturerId,
				);

				return {
					...x,
					ChemicalName: chemicalInfoIdx > -1 ? chemicalsData[chemicalInfoIdx].ChemicalName : '',
					Unit: chemicalInfoIdx > -1 ? chemicalsData[chemicalInfoIdx].Unit : '',
					Origin: chemicalInfoIdx > -1 ? chemicalsData[chemicalInfoIdx].Origin : '',
					ManufacturerName: manufacturerInfoIdx > -1 ? nanufacturersData[manufacturerInfoIdx].Name : '',
				};
			});
	}, [chemicalsData, exportChemicalData, row.original.ExportId]);

	useEffect(() => {
		setChemicalOfExport(getExportChemicalData());
	}, [chemicalsData, exportChemicalData, row.original.ExportId]);

	const handleRequestSort = (property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	useEffect(() => {
		setChemicalOfExport((prev: any) => [
			...prev.sort((a: any, b: any) => {
				let i = order === 'desc' ? descendingComparator(a, b, orderBy) : -descendingComparator(a, b, orderBy);
				return i;
			}),
		]);
	}, [order, orderBy]);

	useEffect(() => {
		const exportChemicals = getExportChemicalData();
		const data = exportChemicals.map((x: any) => ({
			label: removeAccents(
				`${x.ChemicalId} ${x.ChemicalName} ${x.Amount} ${x.ManufacturerName} ${x.Origin}`.toUpperCase(),
			),
			id: x.ChemicalId,
		}));
		setDataSearch(data);
	}, []);

	useEffect(() => {
		const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);
		const exportChemicals = getExportChemicalData();

		if (keyword === '') {
			setChemicalOfExport(exportChemicals);
		} else {
			const data = exportChemicals.filter((x: any) => listId.indexOf(x?.ChemicalId) !== -1);
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
					<Button variant="contained" onClick={handleOpenCreate} sx={{ marginLeft: '24px' }}>
						<AddIcon />
					</Button>
				</Box>
			</Box>
			<TableContainer component={Paper} sx={{ maxHeight: '280px', marginBottom: '24px', overflow: 'overlay' }}>
				<Table sx={{ minWidth: 650 }} stickyHeader size="small">
					<TableHead>
						<TableRow>
							<StyledTableCell align="left">
								<b>#</b>
							</StyledTableCell>
							<StyledTableCell align="left" onClick={() => handleRequestSort('ChemicalId')}>
								<b>Mã hóa chất</b>
								{renderArrowSort(order, orderBy, 'ChemicalId')}
							</StyledTableCell>
							<StyledTableCell align="left" onClick={() => handleRequestSort('ChemicalName')}>
								<b>Tên hóa chất</b>
								{renderArrowSort(order, orderBy, 'ChemicalName')}
							</StyledTableCell>
							<StyledTableCell align="left" onClick={() => handleRequestSort('Amount')}>
								<b>Số lượng</b>
								{renderArrowSort(order, orderBy, 'Amount')}
							</StyledTableCell>
							<StyledTableCell align="left" onClick={() => handleRequestSort('ManufacturerName')}>
								<b>Nhà sản xuất</b>
								{renderArrowSort(order, orderBy, 'ManufacturerName')}
							</StyledTableCell>
							<StyledTableCell align="left" onClick={() => handleRequestSort('Origin')}>
								<b>Xuất xứ</b>
								{renderArrowSort(order, orderBy, 'Origin')}
							</StyledTableCell>
							<StyledTableCell align="left"></StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{chemicalOfExport.map((exportChemical: any, index: number) => (
							<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell align="left">{index + 1}</TableCell>
								<TableCell align="left">{exportChemical.ChemicalId}</TableCell>
								<TableCell align="left">{exportChemical.ChemicalName}</TableCell>
								<TableCell align="left">
									{exportChemical.Amount.toString()} {`(${exportChemical.Unit})`}
								</TableCell>
								<TableCell align="left">{exportChemical.ManufacturerName}</TableCell>
								<TableCell align="left">{exportChemical.Origin}</TableCell>
								<TableCell align="right" size="small">
									<Tooltip arrow placement="left" title="Sửa thông tin phiếu xuất hóa chất">
										<IconButton onClick={() => handleOpenEdit(exportChemical)}>
											<Edit />
										</IconButton>
									</Tooltip>
									<Tooltip arrow placement="right" title="Xoá phiếu xuất hóa chất">
										<IconButton color="error" onClick={() => handleOpenDelete(exportChemical)}>
											<Delete />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default ChemicalTable;
