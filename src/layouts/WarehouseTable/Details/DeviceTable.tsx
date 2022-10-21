import styled from '@emotion/styled';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import {
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
	TableSortLabel,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { MRT_Row } from 'material-react-table';
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { IExportDeviceType } from '../../../types/exportDeviceType';
import { IWarehouseType } from '../../../types/warehouseType';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SearchIcon from '@mui/icons-material/Search';

const StyledTableCell = styled(TableCell)(theme => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: 'lightgray',
	},
}));

type DeviceTableProps = {
	handleOpenCreate: () => void;
	handleOpenEdit: (exportDevice: any) => void;
	handleOpenDelete: (exportDevice: any) => void;
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

const DeviceTable = ({ handleOpenCreate, handleOpenEdit, handleOpenDelete, row }: DeviceTableProps) => {
	const exportDeviceData = useAppSelector((state: RootState) => state.exportDevice.listOfExportDevice);
	const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
	const [deviceOfExport, setDeviceOfExport] = useState<any>([]);
	const [order, setOrder] = useState<string>('asc');
	const [orderBy, setOrderBy] = useState<string>('DeviceId');
	const [keyword, setKeyword] = useState<string>('');
	const [dataSearch, setDataSearch] = useState<any>([]);

	const getExportDeviceData = useCallback(() => {
		return exportDeviceData
			.filter((x: IExportDeviceType) => x.ExportId === row.original.ExportId)
			.map((x: IExportDeviceType) => {
				let deviceIdx = deviceData.findIndex(y => y.DeviceId === x.DeviceId);
				return {
					...x,
					DeviceName: deviceIdx > -1 ? deviceData[deviceIdx].DeviceName : '',
					Unit: deviceIdx > -1 ? deviceData[deviceIdx].Unit : '',
					Origin: deviceIdx > -1 ? deviceData[deviceIdx].Origin : '',
					Model: deviceIdx > -1 ? deviceData[deviceIdx].Model : '',
				};
			});
	}, [deviceData, exportDeviceData, row.original.ExportId]);

	useEffect(() => {
		setDeviceOfExport(getExportDeviceData());
	}, [deviceData, exportDeviceData, row.original.ExportId]);

	const handleRequestSort = (property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	useEffect(() => {
		setDeviceOfExport((prev: any) => [
			...prev.sort((a: any, b: any) => {
				let i = order === 'desc' ? descendingComparator(a, b, orderBy) : -descendingComparator(a, b, orderBy);
				return i;
			}),
		]);
	}, [order, orderBy]);

	useEffect(() => {
		const exportDevices = getExportDeviceData();
		const data = exportDevices.map((x: any) => ({
			label: removeAccents(`${x.DeviceId} ${x.DeviceName} ${x.Quantity} ${x.Model} ${x.Origin}`.toUpperCase()),
			id: x.DeviceId,
		}));
		setDataSearch(data);
	}, []);

	useEffect(() => {
		const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);
		const exportDevices = getExportDeviceData();

		if (keyword === '') {
			setDeviceOfExport(exportDevices);
		} else {
			const data = exportDevices.filter((x: any) => listId.indexOf(x?.DeviceId) !== -1);
			setDeviceOfExport(data);
		}
	}, [keyword, dataSearch]);

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
							<StyledTableCell align="left" onClick={() => handleRequestSort('DeviceId')}>
								<b>Mã thiết bị</b>
								{renderArrowSort(order, orderBy, 'DeviceId')}
							</StyledTableCell>
							<StyledTableCell align="left" onClick={() => handleRequestSort('DeviceName')}>
								<b>Tên thiết bị</b>
								{renderArrowSort(order, orderBy, 'DeviceName')}
							</StyledTableCell>
							<StyledTableCell align="left" onClick={() => handleRequestSort('Quantity')}>
								<b>Số lượng</b>
								{renderArrowSort(order, orderBy, 'Quantity')}
							</StyledTableCell>
							<StyledTableCell align="left" onClick={() => handleRequestSort('Model')}>
								<b>Mẫu</b>
								{renderArrowSort(order, orderBy, 'Model')}
							</StyledTableCell>
							<StyledTableCell align="left" onClick={() => handleRequestSort('Origin')}>
								<b>Xuất xứ</b>
								{renderArrowSort(order, orderBy, 'Origin')}
							</StyledTableCell>
							<StyledTableCell align="left"></StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{deviceOfExport.map((exportDevice: any, index: number) => (
							<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell align="left">{index + 1}</TableCell>
								<TableCell align="left">{exportDevice.DeviceId}</TableCell>
								<TableCell align="left">{exportDevice.DeviceName}</TableCell>
								<TableCell align="left">
									{exportDevice.Quantity.toString()} {`(${exportDevice.Unit})`}
								</TableCell>
								<TableCell align="left">{exportDevice.Model}</TableCell>
								<TableCell align="left">{exportDevice.Origin}</TableCell>
								<TableCell align="right" size="small">
									<Tooltip arrow placement="left" title="Sửa thông tin phiếu xuất thiết bị">
										<IconButton onClick={() => handleOpenEdit(exportDevice)}>
											<Edit />
										</IconButton>
									</Tooltip>
									<Tooltip arrow placement="right" title="Xoá phiếu xuất thiết bị">
										<IconButton color="error" onClick={() => handleOpenDelete(exportDevice)}>
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

export default DeviceTable;
