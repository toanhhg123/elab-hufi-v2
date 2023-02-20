import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import {
	Autocomplete,
	Box,
	Button,
	Checkbox,
	debounce,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	InputAdornment,
	Radio,
	RadioGroup,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import remove from 'lodash/remove';
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { setSnackbarMessage, setSnackbar } from '../../pages/appSlice';
import {
	getDevicesTransfer,
	getInstrumentTransfer,
	postDeviceTransfer,
	postInstrumentTransfer,
} from '../../services/deviceTransfer';
import { dummyDeviceTransferData, IDeviceSerial, IDeviceTransfer } from '../../types/deviceTransferType';
import { DeviceColumnType } from '../DepartmentTable/DeviceOfExperimentCenterTable';
import { colorsNotifi } from '../../configs/color';

const columnDevices: DeviceColumnType[] = [
	{
		id: 'STT',
		header: 'STT',
		size: 100,
	},
	{
		id: 'DeviceInfoId',
		header: 'Serial',
	},
	{
		id: 'DeviceName',
		header: 'Tên thiết bị',
	},
];

const columnIInstruments: DeviceColumnType[] = [
	{
		id: 'STT',
		header: 'STT',
		size: 100,
	},
	{
		id: 'InstrumentDeptId',
		header: 'Mã',
	},
	{
		id: 'DeviceName',
		header: 'Tên thiết bị',
	},
	{
		id: 'QuantityTotal',
		header: 'Số lượng',
	},
];

const types = ['Thiết bị', 'Công cụ - Dụng cụ'];

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
		return order === 'asc' ? (
			<ArrowUpwardIcon sx={{ fontSize: '20px' }} />
		) : (
			<ArrowDownwardIcon sx={{ fontSize: '20px' }} />
		);
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

function DeviceTransfer() {
	const [deviceTransferData, setDeviceTransferData] = useState<IDeviceTransfer[]>([]);
	const dispatch = useAppDispatch();
	const [selected, setSelected] = useState<String[]>([]);
	const [labFrom, setLabFrom] = useState<IDeviceTransfer>(dummyDeviceTransferData);
	const [labTo, setLabTo] = useState<IDeviceTransfer>(dummyDeviceTransferData);
	const [deviceTransfered, setDeviceTransfered] = useState<IDeviceSerial[]>([]);
	const [amountTransfer, setAmountTransfer] = React.useState<Number>(1);
	const [type, setType] = useState<String>(types[0]);

	const handleChangeAmoutTransfer = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (Number(event.target.value) <= Number(event.target.max)) {
			setAmountTransfer(Number(event.target.value));
		}
	};

	const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
		setType((event.target as HTMLInputElement).value);
		setLabFrom(dummyDeviceTransferData);
		setLabTo(dummyDeviceTransferData);
		setSelected([]);
		setDeviceTransfered([]);
		setAmountTransfer(1);
	};

	const columns = useRef(columnDevices);

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelected = labFrom.listDeviceInfo?.map(n => n.DeviceInfoId || '');
			if (newSelected) handleSelect(newSelected);
			return;
		}
		handleSelect([]);
	};

	const getDeviceTransfer = async () => {
		if (type === types[0]) {
			const listOfDeviceTransfer: IDeviceTransfer[] = await getDevicesTransfer();
			if (listOfDeviceTransfer) {
				setDeviceTransferData(listOfDeviceTransfer);
			}
		}

		if (type === types[1]) {
			const listOfDeviceTransfer: IDeviceTransfer[] = await getInstrumentTransfer();
			if (listOfDeviceTransfer) {
				const newList = listOfDeviceTransfer.map(trans => {
					return {
						...trans,
						listDeviceInfo: trans.listInstrument?.map(device => ({
							...device,
							DeviceInfoId: device.InstrumentDeptId,
						})),
					};
				});

				setDeviceTransferData(newList);
			}
		}
	};

	useEffect(() => {
		columns.current = type === types[0] ? columnDevices : columnIInstruments;
		getDeviceTransfer();
	}, [type]);

	const handleClick = (event: React.MouseEvent<unknown>, name: String) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected: String[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		handleSelect(newSelected);
	};

	const isSelected = (name: String) => selected.indexOf(name) !== -1;

	const handleSelect = (value: String[]) => {
		setSelected(value);
	};

	const handleTransfer = () => {
		if (type === types[0]) {
			const listSelect =
				labFrom?.listDeviceInfo?.filter(device => {
					return selected.includes(device.DeviceInfoId || '');
				}) || [];

			setLabFrom(prev => {
				const newDevices = labFrom?.listDeviceInfo?.filter(device => {
					return !selected.includes(device.DeviceInfoId || '');
				});
				return { ...prev, listDeviceInfo: newDevices };
			});

			setDeviceTransfered(prev => [...listSelect, ...prev]);
			setSelected([]);
		} else {
			const listSelect = labFrom?.listDeviceInfo?.find(device => {
				return selected.includes(device.DeviceInfoId || '');
			});

			if (amountTransfer > Number(listSelect?.QuantityTotal || 0)) {
				dispatch(setSnackbarMessage('Số lượng chuyển không thể lớn hơn số lượng hiện có'));
				return;
			}

			if (listSelect) {
				listSelect.QuantityTotal = Number(listSelect.QuantityTotal || 0) - Number(amountTransfer || 0);
				const deviceExist = deviceTransfered.find(device => device.DeviceInfoId === listSelect.DeviceInfoId);

				if (deviceExist) {
					deviceExist.QuantityTotal = Number(deviceExist.QuantityTotal || 0) + Number(amountTransfer || 0);
					setDeviceTransfered([...deviceTransfered]);
				} else {
					setDeviceTransfered(prev => [...prev, { ...listSelect, QuantityTotal: amountTransfer }]);
				}
			}
			setSelected([]);
		}
	};

	const cancelTransfer = (DeviceInfoId: String) => {
		if (type === types[0]) {
			let indexOfBackDevice = deviceTransfered.findIndex(device => device.DeviceInfoId === DeviceInfoId);
			if (indexOfBackDevice !== -1) {
				setLabFrom(prev => {
					return { ...prev, listDeviceInfo: [...(prev.listDeviceInfo || []), deviceTransfered[indexOfBackDevice]] };
				});
			}

			const newDevices = deviceTransfered.filter(device => {
				return device.DeviceInfoId !== DeviceInfoId;
			});
			setDeviceTransfered(newDevices);
		} else {
			let indexOfBackDevice = deviceTransfered.findIndex(device => device.DeviceInfoId === DeviceInfoId);

			if (indexOfBackDevice !== -1) {
				const listSelect = labFrom?.listDeviceInfo?.find(device => {
					return device.DeviceInfoId === deviceTransfered[indexOfBackDevice].DeviceInfoId;
				});

				if (listSelect) {
					listSelect.QuantityTotal =
						Number(listSelect.QuantityTotal || 0) +
						Number(deviceTransfered[indexOfBackDevice].QuantityTotal || 0);
					setLabFrom({ ...labFrom });
				}

				const newDevices = deviceTransfered.filter(device => {
					return device.DeviceInfoId !== DeviceInfoId;
				});
				setDeviceTransfered(newDevices);
			}
		}
	};

	const updateDeviceTransferStore = async (resData: IDeviceTransfer) => {
		if (Object.keys(resData).length !== 0) {
			dispatch(
				setSnackbar({
					message: 'Cập nhật thông tin thành công',
					color: colorsNotifi['success'].color,
					backgroundColor: colorsNotifi['success'].background,
				}),
			);
		} else {
			dispatch(
				setSnackbar({
					message: 'Cập nhật thông tin không thành công',
					color: colorsNotifi['error'].color,
					backgroundColor: colorsNotifi['error'].background,
				}),
			);
		}
		getDeviceTransfer();
	};

	const handleSave = async () => {
		switch (type) {
			case types[0]: {
				let resData = await postDeviceTransfer(labFrom);
				updateDeviceTransferStore(resData);

				resData = await postDeviceTransfer({
					...labTo,
					listDeviceInfo: [...(labTo?.listDeviceInfo || []), ...deviceTransfered],
				});
				updateDeviceTransferStore(resData);
				break;
			}
			case types[1]: {
				let resData = await postInstrumentTransfer([
					{
						LabId: labFrom.LabId,
						LabName: labFrom.LabName,
						Location: labFrom.Location,
						listInstrument:
							labFrom.listDeviceInfo?.reduce((prev: IDeviceSerial[], curr) => {
								const indexExist = deviceTransfered.findIndex(
									x => x.DeviceInfoId === curr.DeviceInfoId,
								);

								if (indexExist !== -1) {
									delete curr.DeviceInfoId;
									return prev.concat(curr);
								}
								return prev;
							}, []) || [],
					},
					{
						LabId: labTo.LabId,
						LabName: labTo.LabName,
						Location: labTo.Location,
						listInstrument:
							deviceTransfered?.map(device => {
								delete device.DeviceInfoId;
								return device;
							}) || [],
					},
				]);

				updateDeviceTransferStore(resData);
				break;
			}
		}

		setLabFrom(dummyDeviceTransferData);
		setLabTo(dummyDeviceTransferData);
		setDeviceTransfered([]);
	};

	const handleSwap = () => {
		setLabFrom(deviceTransferData.find(lab => lab.LabId === labTo.LabId) || dummyDeviceTransferData);
		setLabTo(deviceTransferData.find(lab => lab.LabId === labFrom.LabId) || dummyDeviceTransferData);
		setDeviceTransfered([]);
	};

	return (
		<Box minWidth={480}>
			<h3 style={{ margin: '0px', textAlign: 'left', padding: '0.5rem' }}>
				<b>
					<KeyboardArrowRightIcon
						style={{ margin: '0px', fontSize: '30px', paddingTop: '15px' }}
					></KeyboardArrowRightIcon>
				</b>
				<span>Điều chuyển thiết bị, công cụ, dụng cụ</span>
			</h3>
			<Grid
				container
				spacing={2}
				paddingTop={0}
				paddingLeft={3}
				paddingRight={3}
				paddingBottom={2}
				columns={24}
				sx={{
					flexDirection: {
						xs: 'column',
						lg: 'row',
					},
				}}
			>
				<Grid item xs={24}>
					<Box display="flex" alignItems="center" justifyContent="space-between">
						<Box>
							<FormControl>
								<FormLabel sx={{ textAlign: 'left' }} id="demo-controlled-radio-buttons-group">
									Loại
								</FormLabel>
								<RadioGroup
									aria-labelledby="demo-controlled-radio-buttons-group"
									name="controlled-radio-buttons-group"
									value={type}
									onChange={handleChangeType}
									sx={{
										display: 'flex',
										flexDirection: 'row',
									}}
								>
									<FormControlLabel value={types[0]} control={<Radio />} label={types[0]} />
									<FormControlLabel value={types[1]} control={<Radio />} label={types[1]} />
								</RadioGroup>
							</FormControl>
						</Box>
						<Box height="100%" display="flex" alignItems="center" justifyContent="end">
							<Button variant="contained" onClick={handleSave} disabled={!deviceTransfered.length}>
								Lưu
							</Button>
						</Box>
					</Box>
				</Grid>
				<Grid item lg={11} xs={24}>
					<div>
						<Typography textAlign="left" mb={2}>
							Phòng ban đầu
						</Typography>
						{labFrom && (
							<Autocomplete
								options={deviceTransferData.length > 0 ? deviceTransferData.filter(lab => lab.LabId !== labTo.LabId) : []}
								getOptionLabel={option => `${option.LabId} - ${option.LabName}`}
								renderInput={params => (
									<TextField {...params} label="Phòng ban đầu" placeholder="Phòng ban đầu..." />
								)}
								onChange={(e, value) => {
									if (type === types[1]) {
										deviceTransfered.forEach(x => {
											cancelTransfer(x.DeviceInfoId || '');
										});
									}

									setLabFrom(value || dummyDeviceTransferData);
									setLabTo(
										deviceTransferData.find(lab => lab.LabId === labTo.LabId) ||
										dummyDeviceTransferData,
									);
									setSelected([]);
									setDeviceTransfered([]);
								}}
								value={labFrom}
								isOptionEqualToValue={(option, value) => option.LabId === value.LabId}
							/>
						)}

						<TableFrom
							columns={columns.current}
							handleClick={handleClick}
							handleSelectAllClick={handleSelectAllClick}
							isSelected={isSelected}
							lab={labFrom}
							selected={selected}
						/>
					</div>
				</Grid>
				<Grid item xs={24} lg={2}>
					<Box height="100%" display="flex" alignItems="center" justifyContent="center" flexWrap="wrap">
						<Box>
							<Button
								variant="contained"
								onClick={handleTransfer}
								disabled={
									type === types[0]
										? !selected.length || labTo.LabId === ''
										: selected.length !== 1 || labTo.LabId === ''
								}
								sx={{
									width: {
										lg: '100%',
									},
									marginBottom: {
										lg: '24px',
									},
									marginRight: {
										xs: '24px',
										lg: '0',
									},
								}}
							>
								Chuyển
							</Button>

							<Button
								variant="contained"
								onClick={handleSwap}
								sx={{
									width: {
										lg: '100%',
									},
									marginBottom: {
										lg: '24px',
									},
									marginRight: {
										xs: '24px',
										lg: '0',
									},
								}}
							>
								<CompareArrowsIcon />
							</Button>

							{type === types[1] && (
								<TextField
									id="standard-number"
									label="Số lượng"
									type="number"
									onChange={handleChangeAmoutTransfer}
									value={amountTransfer}
									disabled={selected.length !== 1}
									inputProps={{
										min: 1,
										max:
											labFrom?.listDeviceInfo?.find(device => {
												return selected.includes(device.DeviceInfoId || '');
											})?.QuantityTotal || 1,
									}}
									InputLabelProps={{
										shrink: true,
									}}
									variant="standard"
								/>
							)}
						</Box>
					</Box>
				</Grid>
				<Grid item lg={11} xs={24}>
					<div>
						<Typography textAlign="left" mb={2}>
							Phòng chuyển đến
						</Typography>
						{labTo && (
							<Autocomplete
								options={deviceTransferData.length > 0 ? deviceTransferData?.filter(lab => lab.LabId !== labFrom.LabId) : []}
								getOptionLabel={option => `${option.LabId} - ${option.LabName}`}
								renderInput={params => (
									<TextField {...params} label="Phòng chuyển đến" placeholder="Phòng chuyển đến..." />
								)}
								onChange={(e, value) => {
									if (type === types[1]) {
										deviceTransfered.forEach(x => {
											cancelTransfer(x.DeviceInfoId || '');
										});
									}

									setLabTo(value || dummyDeviceTransferData);
									setLabFrom(
										deviceTransferData.find(lab => lab.LabId === labFrom.LabId) ||
										dummyDeviceTransferData,
									);
									setSelected([]);
									setDeviceTransfered([]);
								}}
								value={labTo}
								isOptionEqualToValue={(option, value) => option.LabId === value.LabId}
							/>
						)}

						<TableTo
							cancelTransfer={cancelTransfer}
							columns={columns.current}
							deviceTransfered={deviceTransfered}
							lab={labTo}
							type={type}
						/>
					</div>
				</Grid>
			</Grid>
		</Box>
	);
}

type TableFromProps = {
	selected: String[];
	lab: IDeviceTransfer;
	handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	columns: DeviceColumnType[];
	isSelected: (name: String) => boolean;
	handleClick: (event: React.MouseEvent<unknown>, name: String) => void;
};

function TableFrom({ selected, lab, handleSelectAllClick, columns, isSelected, handleClick }: TableFromProps) {
	const [data, setData] = useState<IDeviceSerial[]>([]);
	const [order, setOrder] = useState<string>('asc');
	const [orderBy, setOrderBy] = useState<string>('ChemDetailId');
	const [keyword, setKeyword] = useState<string>('');
	const [dataSearch, setDataSearch] = useState<any>([]);

	const handleRequestSort = (property: string) => {
		if (property === 'STT') return;
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};
	useEffect(() => {
		setData(lab?.listDeviceInfo || []);
	}, [lab?.listDeviceInfo]);

	useEffect(() => {
		setData(prev => {
			let data = [...prev];
			data?.sort((a, b) => {
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
		const resultSearch = lab?.listDeviceInfo?.map(x => {
			let string: String = '';

			Object.keys(x).forEach(key => {
				if (typeof x[key as keyof typeof x] === 'string') string += x[key as keyof typeof x] + ' ';
				if (typeof x[key as keyof typeof x] === 'number') string += x[key as keyof typeof x]?.toString() + ' ';
			});

			return {
				label: removeAccents(string.toUpperCase()),
				id: x?.DeviceInfoId,
			};
		});
		setDataSearch(resultSearch);
	}, [lab?.listDeviceInfo]);

	useEffect(() => {
		const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);

		if (keyword === '') {
			setData(lab?.listDeviceInfo || []);
		} else {
			const data = lab?.listDeviceInfo?.filter(x => listId.indexOf(x?.DeviceInfoId) !== -1);
			setData(data || []);
		}
	}, [keyword, dataSearch, lab?.listDeviceInfo]);

	return (
		<>
			<TextField
				sx={{
					marginTop: '24px',
					marginBottom: '4px',
				}}
				fullWidth
				size="small"
				placeholder="Tìm kiếm...."
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon />
						</InputAdornment>
					),
				}}
				variant="standard"
				onChange={debounce(e => setKeyword(removeAccents(e.target.value.toUpperCase())), 300)}
			/>
			<TableContainer
				component={Paper}
				sx={{
					minHeight: {
						xs: '280px',
						lg: '480px',
					},
				}}
			>
				<Table size="small" stickyHeader sx={{ minWidth: '600px' }}>
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox" sx={{ background: '#d3d3d3' }}>
								<Checkbox
									color="primary"
									indeterminate={
										selected.length > 0 && selected.length < (lab?.listDeviceInfo?.length || 0)
									}
									checked={
										(lab?.listDeviceInfo?.length || 0) > 0 &&
										selected.length === lab?.listDeviceInfo?.length
									}
									onChange={handleSelectAllClick}
									inputProps={{
										'aria-label': 'select all desserts',
									}}
								/>
							</TableCell>
							{columns?.map(col => (
								<TableCell
									key={col.id}
									sx={{ background: '#d3d3d3', width: `${col?.size}px` }}
									onClick={() => handleRequestSort(col.id)}
								>
									{col.header}{' '}
									<span
										style={{
											fontSize: '16px',
										}}
									>
										{renderArrowSort(order, orderBy, col.id)}
									</span>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length === 0 && (
							<TableRow>
								<TableCell colSpan={4} sx={{ borderBottom: '0', textAlign: 'center' }}>
									<h3 style={{ width: '100%', padding: '16px 0px' }}>Trống</h3>
								</TableCell>
							</TableRow>
						)}
						{data?.map((device, index) => {
							const isItemSelected = isSelected(device.DeviceInfoId || '');
							const labelId = `enhanced-table-checkbox-${index}`;
							return (
								<TableRow
									key={`${device.DeviceInfoId}`}
									selected={isItemSelected}
									role="checkbox"
									onClick={event => handleClick(event, device.DeviceInfoId || '')}
									sx={{ position: 'relative' }}
								>
									<TableCell padding="checkbox">
										<Checkbox
											color="primary"
											checked={isItemSelected}
											inputProps={{
												'aria-labelledby': labelId,
											}}
										/>
									</TableCell>
									{columns.map(col => {
										if (col.id === 'STT') return <TableCell key={col.id}>{index + 1}</TableCell>;
										return (
											<TableCell key={col.id}>{`${device[col.id as keyof typeof device]
												}`}</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

type TableToProps = {
	columns: DeviceColumnType[];
	lab: IDeviceTransfer;
	deviceTransfered: IDeviceSerial[];
	cancelTransfer: (DeviceInfoId: String) => void;
	type: String;
};

function TableTo({ columns, lab, deviceTransfered, cancelTransfer, type }: TableToProps) {
	const [data, setData] = useState<IDeviceSerial[]>([]);

	const [order, setOrder] = useState<string>('asc');
	const [orderBy, setOrderBy] = useState<string>('ChemDetailId');
	const [keyword, setKeyword] = useState<string>('');
	const [dataSearch, setDataSearch] = useState<any>([]);

	const handleRequestSort = (property: string) => {
		if (property === 'STT') return;
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	useEffect(() => {
		switch (type) {
			case types[0]: {
				setData([...(lab?.listDeviceInfo || []), ...deviceTransfered]);
				break;
			}
			case types[1]: {
				const newList: IDeviceSerial[] = deviceTransfered.reduce((prev: IDeviceSerial[], curr) => {
					const device = lab?.listDeviceInfo?.find(dev => dev.DeviceInfoId === curr.DeviceInfoId);
					if (device) {
						return prev.concat({
							...device,
							QuantityTotal: Number(device.QuantityTotal) + Number(curr.QuantityTotal),
						});
					} else {
						return prev.concat(curr);
					}
				}, []);
				const listId = newList.map(x => x.DeviceInfoId) || [];
				const result = remove([...deviceTransfered, ...(lab?.listDeviceInfo || [])], function (n: any) {
					return !listId.includes(n.DeviceInfoId);
				});
				setData([...result, ...newList]);
				break;
			}
			default:
				break;
		}
	}, [deviceTransfered, lab?.listDeviceInfo]);

	useEffect(() => {
		setData(prev => {
			let data = [...prev];
			data?.sort((a, b) => {
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
		const resultSearch = lab?.listDeviceInfo?.map(x => {
			let string: String = '';

			Object.keys(x).forEach(key => {
				if (typeof x[key as keyof typeof x] === 'string') string += x[key as keyof typeof x] + ' ';
				if (typeof x[key as keyof typeof x] === 'number') string += x[key as keyof typeof x]?.toString() + ' ';
			});

			return {
				label: removeAccents(string.toUpperCase()),
				id: x?.DeviceInfoId,
			};
		});
		setDataSearch(resultSearch);
	}, [lab?.listDeviceInfo]);

	useEffect(() => {
		const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);

		if (keyword === '') {
			setData(lab?.listDeviceInfo || []);
		} else {
			const data = lab?.listDeviceInfo?.filter(x => listId.indexOf(x?.DeviceInfoId) !== -1);
			setData(data || []);
		}
	}, [keyword, dataSearch, lab?.listDeviceInfo]);

	return (
		<>
			<TextField
				sx={{
					marginTop: '24px',
					marginBottom: '4px',
				}}
				fullWidth
				size="small"
				placeholder="Tìm kiếm...."
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon />
						</InputAdornment>
					),
				}}
				variant="standard"
				onChange={debounce(e => setKeyword(removeAccents(e.target.value.toUpperCase())), 300)}
			/>
			<TableContainer
				component={Paper}
				sx={{
					minHeight: {
						xs: '280px',
						lg: '480px',
					},
				}}
			>
				<Table size="small" stickyHeader sx={{ minWidth: '600px' }}>
					<TableHead>
						<TableRow>
							{columns?.map(col => (
								<TableCell
									key={col.id}
									sx={{ width: `${col?.size}px`, background: '#d3d3d3' }}
									onClick={() => handleRequestSort(col.id)}
								>
									{col.header}{' '}
									<span
										style={{
											fontSize: '16px',
										}}
									>
										{renderArrowSort(order, orderBy, col.id)}
									</span>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{[...deviceTransfered, ...(lab?.listDeviceInfo || [])]?.length === 0 && (
							<TableRow>
								<TableCell colSpan={3} sx={{ borderBottom: '0', textAlign: 'center' }}>
									<h3 style={{ width: '100%', padding: '16px 0px' }}>Trống</h3>
								</TableCell>
							</TableRow>
						)}

						{data.map((device, index) => {
							return (
								<TableRow key={`${device.DeviceInfoId}`} role="checkbox" sx={{ position: 'relative' }}>
									{columns.map(col => {
										if (col.id === 'STT') return <TableCell key={col.id}>{index + 1}</TableCell>;
										return (
											<TableCell key={col.id}>{`${device[col.id as keyof typeof device]
												}`}</TableCell>
										);
									})}

									{deviceTransfered.findIndex(dev => dev.DeviceInfoId === device.DeviceInfoId) !==
										-1 && (
										<Button
											onClick={() => cancelTransfer(device.DeviceInfoId || '')}
											color="error"
											sx={{
												position: 'absolute',
												top: 0,
												display: 'flex',
												right: 0,
												alignItems: 'center',
												justifyContent: 'center',
												bottom: '1px',
												minWidth: '40px',
											}}
											aria-label="delete"
										>
											<CloseIcon />
										</Button>
									)}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

export default DeviceTransfer;
