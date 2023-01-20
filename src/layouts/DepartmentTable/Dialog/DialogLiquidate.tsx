import CloseIcon from '@mui/icons-material/Close';
import {
	Autocomplete,
	Box,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	Input,
	InputLabel,
	TextField,
	Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import DataGrid, {
	Button as DevButtonGrid,
	Column,
	ColumnChooser,
	ColumnFixing,
	Editing,
	FilterRow,
	Grouping,
	HeaderFilter,
	Item,
	MasterDetail,
	Pager,
	Paging,
	RequiredRule,
	Scrolling,
	SearchPanel,
	Toolbar,
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Add from '@mui/icons-material/Add';
import { Item as TabItem, TabPanel } from 'devextreme-react/tab-panel';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import _ from 'lodash';
import moment from 'moment';
import { colorsNotifi } from '../../../configs/color';
import { useAppDispatch } from '../../../hooks';
import { setSnackbar } from '../../../pages/appSlice';
import {
	deleteLiquidateDept,
	getLiquidateDept,
	getLiquidateDeptDevices,
	getLiquidateDeptInstruments,
	postLiquidateDept,
	updateLiquidateDept,
} from '../../../services/liquidateDeviceServices';
import { dummyLiquidateDept, ILiquidateDept } from '../../../types/deviceDepartmentType';
import { ILiquidateDeptDevice } from '../../../types/deviceType';
import { ILiquidateDeptInstrument } from '../../../types/instrumentType';
import { useDeviceOfDepartmentTableStore } from '../context/DeviceOfDepartmentTableContext';
import { renderHeader } from './DialogImportDeviceInfo';
import { ColumnSizeType, ColumnsType, DialogProps, ErrorType } from './DialogType';

const userLogin = {
	EmployeeId: '02003019',
	EmployeeName: 'Dương Thị Ngọc Hân',
	DepartmentId: 2,
	DepartmentName: 'Khoa Công nghệ thực phẩm',
};

const DialogLiquidate = ({ isOpen, onClose }: DialogProps) => {
	const dataGridRef = useRef<DataGrid<any, any> | null>(null);
	const [liquidateDeptDevice, setLiquidateDeptDevice] = useState<ILiquidateDept[]>([]);
	const [openCreate, setOpenCreate] = useState<{ isOpen: boolean; type: string }>({ isOpen: false, type: 'POST' });
	const { id } = useDeviceOfDepartmentTableStore();
	const [initDataDialog, setInitDataDialog] = useState<ILiquidateDept | null>(null);
	const dispatch = useAppDispatch();

	const getLiquidateDeptDevice = useCallback(async () => {
		let data: ILiquidateDept[] = await getLiquidateDept(id);

		setLiquidateDeptDevice(data);
	}, [id]);

	const renderHeader = (data: any, isRequired: boolean = false) => {
		return (
			<b style={{ color: 'black' }}>
				{data.column.caption} {isRequired && <span style={{ color: 'red' }}>*</span>}
			</b>
		);
	};

	const dataSource = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: Array.isArray(liquidateDeptDevice) ? liquidateDeptDevice : [],
				key: 'ExpLiquidateDeptId',
			}),
		});
	}, [liquidateDeptDevice]);

	useEffect(() => {
		getLiquidateDeptDevice();
	}, [isOpen]);

	const handleDeleteLiquidate = async (row: any) => {
		try {
			const deleted: any = await deleteLiquidateDept(row?.key);
			if (deleted?.status !== 200 || deleted === undefined) {
				throw new Error();
			}
			dispatch(
				setSnackbar({
					message: 'Xóa thành công',
					color: colorsNotifi['success'].color,
					backgroundColor: colorsNotifi['success'].background,
				}),
			);
		} catch (err) {
			if (row?.data) {
				dataSource.store().insert(row?.data);
				dataSource.reload();
				dispatch(
					setSnackbar({
						message: 'Đã xảy ra lỗi!!!',
						color: colorsNotifi['error'].color,
						backgroundColor: colorsNotifi['error'].background,
					}),
				);
			}
		}
	};

	return (
		<Dialog open={isOpen} onClose={onClose} fullScreen PaperProps={{ style: { maxWidth: 'unset' } }}>
			<DialogTitle textAlign="left">
				<b>Thanh lý thiết bị, công cụ, dụng cụ</b>

				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: theme => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ overflow: 'hidden', display: 'flex' }}>
				<Box py={1} display="flex" flexDirection="column" overflow="hidden" height="100%">
					<div id="data-grid" style={{ display: 'flex', height: '100%', width: '100%', overflowX: 'auto' }}>
						<DataGrid
							ref={dataGridRef}
							id="gridContainer"
							dataSource={dataSource}
							showBorders={true}
							columnAutoWidth={true}
							allowColumnResizing={true}
							columnResizingMode="widget"
							columnMinWidth={100}
							searchPanel={{
								visible: true,
								width: 240,
								placeholder: 'Tìm kiếm',
							}}
							editing={{
								confirmDelete: true,
								allowDeleting: true,
								allowAdding: true,
							}}
							onRowRemoving={row => {
								handleDeleteLiquidate(row);
							}}
							elementAttr={{ style: 'height: 100%; padding-bottom: 20px; width: 100%; min-width: 800px' }}
						>
							<ColumnChooser enabled={true} mode="select" />
							<Paging enabled={false} />
							<FilterRow visible={true} applyFilter={true} />
							<HeaderFilter visible={true} />
							<ColumnFixing enabled={false} />
							<Grouping contextMenuEnabled={true} expandMode="rowClick" />

							<Pager
								allowedPageSizes={true}
								showInfo={true}
								showNavigationButtons={true}
								showPageSizeSelector={true}
								visible={true}
							/>
							<Paging defaultPageSize={30} />

							<Column
								dataField="ExpLiquidateDeptId"
								caption="Mã thanh lý"
								dataType="string"
								headerCellRender={data => renderHeader(data, true)}
							>
								<RequiredRule />
							</Column>
							<Column
								dataField="Content"
								caption="Nội dung"
								headerCellRender={data => renderHeader(data, true)}
							>
								<RequiredRule />
							</Column>
							<Column
								dataField="ExportDate"
								caption="Ngày thanh lý"
								width={120}
								headerCellRender={data => renderHeader(data)}
								cellRender={data => <span>{moment.unix(Number(data.text)).format('DD/MM/YYYY')}</span>}
							></Column>
							<Column
								dataField="EmployeeName"
								caption="Người thanh lý"
								headerCellRender={data => renderHeader(data)}
								cellRender={data => (
									<span>{`${data?.data?.EmployeeId || ''} - ${data.text || ''}`}</span>
								)}
							></Column>
							<Column
								dataField="DepartmentName"
								caption="Khoa"
								headerCellRender={data => renderHeader(data)}
							></Column>
							<Column
								dataField="Accept"
								caption="Tình trạng phiếu"
								headerCellRender={data => renderHeader(data)}
								cellRender={cell => {
									if (!cell.data?.DateStartUsage) return <p style={{ margin: '0' }}></p>;
									return <p style={{ margin: '0' }}>{cell.text}</p>;
								}}
							></Column>

							<Column
								dataField="UserAccept"
								caption="Người chấp nhận"
								dataType="number"
								headerCellRender={data => renderHeader(data)}
							></Column>
							<Column type="buttons">
								<DevButtonGrid
									icon="edit"
									onClick={(e: any) => {
										setOpenCreate({ isOpen: true, type: 'PUT' });
										setInitDataDialog(e.row.data);
									}}
								/>
								<DevButtonGrid icon="trash" name="delete" />
							</Column>
							<Toolbar>
								<Item name="columnChooserButton" />
								<Item name="searchPanel" showText="always" />
								<Item>
									<Button
										variant="outlined"
										sx={{
											minWidth: 'unset',
											padding: '4px',
											marginLeft: '15px',
											borderColor: '#dddddd',
											color: '#000',
										}}
										onClick={() => {
											setOpenCreate({ isOpen: true, type: 'POST' });
											setInitDataDialog(null);
										}}
										startIcon={<Add />}
									>
										Thêm mới
									</Button>
								</Item>
							</Toolbar>
							<MasterDetail enabled={true} component={DetailTemplate} />
						</DataGrid>
					</div>

					{openCreate.isOpen && (
						<DialogCreateLiquidate
							isOpen={openCreate.isOpen}
							type={openCreate.type}
							getLiquidateDept={getLiquidateDeptDevice}
							onClose={() => {
								setOpenCreate(prev => ({ ...prev, isOpen: false }));
							}}
							data={initDataDialog || {}}
						/>
					)}
				</Box>
			</DialogContent>
		</Dialog>
	);
};

const DetailTemplate = (props: any) => {
	const [listDevice, setListDevice] = useState<ILiquidateDeptDevice[]>([]);
	const [listInstrument, setListInstrument] = useState<ILiquidateDeptInstrument[]>([]);

	function isLiquidateDevice(obj: any): obj is ILiquidateDeptDevice {
		if (obj !== null) return 'DeviceInfoId' in obj && 'SerialNumber' in obj && 'DeviceId' in obj;
		return false;
	}

	function isLiquidateInstrument(obj: any): obj is ILiquidateDeptInstrument {
		if (obj !== null) return 'InstrumentDeptId' in obj && 'Quantity' in obj && 'DeviceId' in obj;
		return false;
	}

	useEffect(() => {
		if (
			Array.isArray(props?.data?.data?.listDevice) &&
			props?.data?.data?.listDevice.length > 0 &&
			isLiquidateDevice(props?.data?.data?.listDevice[0])
		) {
			setListDevice(props?.data?.data?.listDevice || []);
		}

		if (
			Array.isArray(props?.data?.data?.listInstrument) &&
			props?.data?.data?.listInstrument.length > 0 &&
			isLiquidateInstrument(props?.data?.data?.listInstrument[0])
		) {
			setListInstrument(props?.data?.data?.listInstrument || []);
		}
	}, [props]);

	const dataSourceDevice = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: listDevice,
				key: 'DeviceInfoId',
			}),
		});
	}, [listDevice]);

	const dataSourceInstrument = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: listInstrument,
				key: 'InstrumentDeptId',
			}),
		});
	}, [listInstrument]);

	return (
		<>
			<Box mb={2}>
				<DataGrid
					dataSource={dataSourceDevice}
					showBorders={true}
					columnAutoWidth={true}
					allowColumnResizing={true}
					columnResizingMode="widget"
					columnMinWidth={50}
					loadPanel={{
						enabled: true,
					}}
				>
					<SearchPanel visible={true} width={240} placeholder="Tìm kiếm" />
					<FilterRow visible={true} applyFilter={true} />
					<HeaderFilter visible={true} />
					<Column
						dataField="DeviceInfoId"
						caption="Mã thông tin thiết bị"
						headerCellRender={data => renderHeader(data)}
					/>
					<Column
						dataField="SerialNumber"
						caption="Sô Serial"
						headerCellRender={data => renderHeader(data)}
					/>
					<Column dataField="DeviceId" caption="Mã thiết bị" headerCellRender={data => renderHeader(data)} />
					<Column
						dataField="DeviceName"
						caption="Tên thiết bị"
						headerCellRender={data => renderHeader(data)}
					/>
					<Column dataField="Unit" caption="Đơn vị" headerCellRender={data => renderHeader(data)} />
					<Toolbar>
						<Item location='before'>
							<Typography variant="button" display="block" mb={0}>
								<b>Thiết bị</b>
							</Typography>
						</Item>
						<Item name="searchPanel" showText="always" />
					</Toolbar>
				</DataGrid>
			</Box>

			<Box>
				<DataGrid
					dataSource={dataSourceInstrument}
					showBorders={true}
					columnAutoWidth={true}
					allowColumnResizing={true}
					columnResizingMode="widget"
					columnMinWidth={50}
					loadPanel={{
						enabled: true,
					}}
				>
					<SearchPanel visible={true} width={240} placeholder="Tìm kiếm" />
					<FilterRow visible={true} applyFilter={true} />
					<HeaderFilter visible={true} />
					<Column
						dataField="InstrumentDeptId"
						caption="Mã thông tin CC - DC"
						headerCellRender={data => renderHeader(data)}
					/>
					<Column
						dataField="DeviceId"
						caption="Mã công cụ - dụng cụ"
						headerCellRender={data => renderHeader(data)}
					/>
					<Column
						dataField="DeviceName"
						caption="Tên công cụ - dụng cụ"
						headerCellRender={data => renderHeader(data)}
					/>
					<Column dataField="Quantity" caption="Số lượng" headerCellRender={data => renderHeader(data)} />
					<Column dataField="LabId" caption="Phòng" headerCellRender={data => renderHeader(data)} />
					<Toolbar>
						<Item location='before'>
							<Typography variant="button" display="block" mb={0}>
							<b>Công cụ - Dụng cụ</b>
							</Typography>
						</Item>
						<Item name="searchPanel" showText="always" />
					</Toolbar>
				</DataGrid>
			</Box>
		</>
	);
};

const DialogCreateLiquidate = ({
	isOpen,
	onClose,
	getLiquidateDept,
	data,
	type,
}: DialogProps & { data: ILiquidateDept | {}; getLiquidateDept: () => Promise<void>; type: string }) => {
	const [liquidate, setLiquidate] = useState<ILiquidateDept>({ ...dummyLiquidateDept, ...userLogin, ...data });
	const [openAutocomplete, setOpenAutocomplete] = useState<{ device: boolean; instrument: boolean }>({
		device: false,
		instrument: false,
	});
	const [loading, setLoading] = useState<boolean>(true);
	const [listDevice, setListDevice] = useState<ILiquidateDeptDevice[]>([]);
	const [listInstrument, setListInstrument] = useState<Omit<ILiquidateDeptInstrument, 'Quantity'>[]>([]);
	const { id } = useDeviceOfDepartmentTableStore();
	const [selectedDevices, setSelectedDevices] = useState<ILiquidateDeptDevice[]>([]);
	const [selectedInstruments, setSelectedInstruments] = useState<ILiquidateDeptInstrument[]>([]);
	const [errors, setErrors] = useState<ErrorType[]>([]);
	const dispatch = useAppDispatch();
	const columns = useRef<(ColumnsType & { colSize: ColumnSizeType; required?: boolean; readonly?: boolean })[]>([
		{ id: 'ExpLiquidateDeptId', header: 'Mã phiếu thanh lý', colSize: { md: 3, sm: 6, xs: 12 }, required: true },
		{ id: 'ExportDate', header: 'Ngày thanh lý', colSize: { md: 3, sm: 6, xs: 12 }, required: true },
		{
			id: 'EmployeeName',
			header: 'Người thanh lý',
			colSize: { md: 3, sm: 6, xs: 12 },
			required: true,
			readonly: true,
		},
		{ id: 'DepartmentName', header: 'Khoa', colSize: { md: 3, sm: 6, xs: 12 }, required: true, readonly: true },
		{ id: 'Content', header: 'Nội dung', colSize: { md: 6, xs: 12 } },
		{ id: 'Note', header: 'Ghi chú', colSize: { md: 6, xs: 12 } },
	]);

	const handleDebouncedInput = _.debounce((key: string, value: string) => {
		setLiquidate(prev => ({
			...prev,
			[key]: value,
		}));
	}, 200);

	useEffect(() => {
		(async () => {
			try {
				let listDevice: ILiquidateDeptDevice[] = await getLiquidateDeptDevices(id);
				let listInstrument: ILiquidateDeptInstrument[] = await getLiquidateDeptInstruments(id);
				setListDevice(listDevice);
				setListInstrument(listInstrument);
			} catch (err) {
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const dataSourceDevice = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: [...liquidate.listDevice, ...selectedDevices],
				key: 'DeviceInfoId',
			}),
		});
	}, [selectedDevices]);

	const dataSourceInstrument = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: [...liquidate.listInstrument, ...selectedInstruments],
				key: 'InstrumentDeptId',
			}),
		});
	}, [selectedInstruments]);

	useEffect(() => {
		setListDevice(prev => {
			return prev.filter(x => selectedDevices.findIndex(s => s.DeviceInfoId === x.DeviceInfoId) === -1);
		});
	}, [selectedDevices]);

	useEffect(() => {
		setListInstrument(prev => {
			return prev.filter(
				x => selectedInstruments.findIndex(s => s.InstrumentDeptId === x.InstrumentDeptId) === -1,
			);
		});
	}, [selectedInstruments]);

	const handleConfirm = async () => {
		let postData: ILiquidateDept = {
			...liquidate,
			Accept: 'Create New',
			UserAccept: null,
			listDevice: selectedDevices,
			listInstrument: selectedInstruments,
		};
		let errorList: ErrorType[] = [];

		columns.current.forEach(col => {
			if (`${postData[col.id as keyof typeof postData]}`.trim() === '' && col.required) {
				errorList.push({ id: col.id, msg: `${col.header} là bắt buộc` });
			}
		});

		if (postData.listDevice.length === 0 && postData.listInstrument.length === 0) {
			dispatch(
				setSnackbar({
					message: 'Danh sách thiết bị và công cụ - dụng cụ không được để trống!!!',
					color: colorsNotifi['error'].color,
					backgroundColor: colorsNotifi['error'].background,
				}),
			);
			return;
		}

		setErrors(errorList);

		if (errorList.length === 0) {
			try {
				switch (type) {
					case 'POST': {
						const postRes = await postLiquidateDept(postData);

						if (Object.keys(postRes).length > 0) {
							dispatch(
								setSnackbar({
									message: 'Thêm thành công',
									color: colorsNotifi['success'].color,
									backgroundColor: colorsNotifi['success'].background,
								}),
							);
							getLiquidateDept();
						} else {
							throw new Error();
						}
						break;
					}
					case 'PUT': {
						const postRes = await updateLiquidateDept({
							...postData,
							listDevice: dataSourceDevice.items(),
							listInstrument: dataSourceInstrument.items(),
						});
						if (Object.keys(postRes).length > 0) {
							dispatch(
								setSnackbar({
									message: 'Sửa thành công',
									color: colorsNotifi['success'].color,
									backgroundColor: colorsNotifi['success'].background,
								}),
							);
							getLiquidateDept();
						} else {
							throw new Error();
						}
						break;
					}
					default:
						break;
				}
			} catch (error) {
				dispatch(
					setSnackbar({
						message: 'Đã xảy ra lỗi!!!',
						color: colorsNotifi['error'].color,
						backgroundColor: colorsNotifi['error'].background,
					}),
				);
			}
		}
	};

	const renderInfo = useCallback(() => {
		return (
			<>
				{columns.current.map(col => {
					let indexError = errors.findIndex(err => err.id === col.id);
					if (col.id === 'ExportDate') {
						return (
							<Grid item {...col.colSize} key={col.id}>
								<FormControl error={indexError !== -1} variant="standard" fullWidth>
									<InputLabel htmlFor={col.id}>
										{col.header}{' '}
										{col?.required && (
											<>
												(<span style={{ color: 'red' }}>⁕</span>)
											</>
										)}
									</InputLabel>
									<Input
										type="date"
										id={col.id}
										readOnly={col?.readonly}
										defaultValue={
											new Date(
												Number(liquidate[col.id as keyof typeof liquidate]) * 1000,
											).toLocaleDateString('en-CA') !== '1970-01-01'
												? new Date(
														Number(liquidate[col.id as keyof typeof liquidate]) * 1000,
												  ).toLocaleDateString('en-CA')
												: new Date().toLocaleDateString('en-CA')
										}
										onChange={e =>
											handleDebouncedInput(col.id, `${Number(new Date('2023-10-09')) / 1000}`)
										}
									/>
									{indexError !== -1 && <FormHelperText>{errors[indexError].msg}</FormHelperText>}
								</FormControl>
							</Grid>
						);
					}

					return (
						<Grid item {...col.colSize} key={col.id}>
							<FormControl error={indexError !== -1} variant="standard" fullWidth>
								<InputLabel htmlFor={col.id}>
									{col.header}{' '}
									{col?.required && (
										<>
											(<span style={{ color: 'red' }}>⁕</span>)
										</>
									)}
								</InputLabel>
								<Input
									readOnly={col?.readonly}
									disabled={col?.readonly}
									id={col.id}
									onChange={e => handleDebouncedInput(col.id, e.target.value)}
									defaultValue={liquidate[col.id as keyof typeof liquidate]}
								/>
								{indexError !== -1 && <FormHelperText>{errors[indexError].msg}</FormHelperText>}
							</FormControl>
						</Grid>
					);
				})}
			</>
		);
	}, [liquidate, errors]);

	return (
		<Dialog open={isOpen} onClose={onClose} PaperProps={{ style: { maxWidth: 'unset' } }}>
			<DialogTitle textAlign="left">
				{type === 'POST' && <b>Thêm phiếu thanh lý thiết bị</b>}
				{type === 'PUT' && <b>Sửa phiếu thanh lý thiết bị</b>}

				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: theme => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					{renderInfo()}
				</Grid>

				<Box mt={2}>
					<TabPanel>
						<TabItem
							title="Thiết bị"
							render={() => (
								<Box padding={2}>
									<Autocomplete
										open={openAutocomplete.device}
										onOpen={() => {
											setOpenAutocomplete(prev => ({ ...prev, device: true }));
										}}
										onClose={() => {
											setOpenAutocomplete(prev => ({ ...prev, device: false }));
										}}
										sx={{
											marginBottom: '10px',
										}}
										isOptionEqualToValue={(option, value) =>
											option.DeviceInfoId === value.DeviceInfoId
										}
										getOptionLabel={option =>
											`${option.DeviceInfoId} - ${option.SerialNumber} - ${option.DeviceName}`
										}
										options={listDevice}
										loading={loading}
										onChange={(e, value) => {
											if (value !== null) {
												setSelectedDevices(prev => [...prev, value]);
											}
										}}
										renderInput={params => (
											<TextField
												{...params}
												inputProps={{
													...params.inputProps,
													value: '',
												}}
												label="Thiết bị..."
												InputProps={{
													...params.InputProps,
													endAdornment: (
														<>
															{loading ? (
																<CircularProgress color="inherit" size={20} />
															) : null}
															{params.InputProps.endAdornment}
														</>
													),
												}}
											/>
										)}
									/>

									<DataGrid
										dataSource={dataSourceDevice}
										showBorders={true}
										height={400}
										remoteOperations={true}
										columnAutoWidth={true}
										allowColumnResizing={true}
										columnResizingMode="widget"
										columnMinWidth={50}
										loadPanel={{
											enabled: true,
										}}
									>
										<SearchPanel visible={true} width={240} placeholder="Tìm kiếm thiết bị" />
										<HeaderFilter visible={true} />
										<Scrolling mode="virtual" />
										<Editing mode="row" allowDeleting={true} useIcons={true} />
										<Column
											dataField="DeviceInfoId"
											caption="Mã chi tiết thiết bị"
											headerCellRender={data => renderHeader(data)}
											cssClass="bg-header-table"
										/>
										<Column
											dataField="SerialNumber"
											caption="Số Serial"
											headerCellRender={data => renderHeader(data)}
										/>
										<Column
											dataField="DeviceId"
											caption="Mã thiết bị"
											headerCellRender={data => renderHeader(data)}
										/>
										<Column
											dataField="DeviceName"
											caption="Tên thiết bị"
											headerCellRender={data => renderHeader(data)}
										/>
										<Column
											dataField="Unit"
											caption="Đơn vị"
											headerCellRender={data => renderHeader(data)}
										/>
									</DataGrid>
								</Box>
							)}
						></TabItem>

						<TabItem
							title="Công cụ - Dụng cụ"
							render={() => (
								<Box padding={2}>
									<Autocomplete
										open={openAutocomplete.instrument}
										onOpen={() => {
											setOpenAutocomplete(prev => ({ ...prev, instrument: true }));
										}}
										onClose={() => {
											setOpenAutocomplete(prev => ({ ...prev, instrument: false }));
										}}
										sx={{
											marginBottom: '10px',
										}}
										isOptionEqualToValue={(option, value) =>
											option.InstrumentDeptId === value.InstrumentDeptId
										}
										getOptionLabel={option => `${option.InstrumentDeptId} - ${option.DeviceName}`}
										options={listInstrument}
										loading={loading}
										onChange={(e, value) => {
											if (value !== null) {
												setSelectedInstruments(prev => [...prev, { ...value, Quantity: 0 }]);
											}
										}}
										renderInput={params => (
											<TextField
												{...params}
												inputProps={{
													...params.inputProps,
													value: '',
												}}
												label="Công cụ - Dụng cụ..."
												InputProps={{
													...params.InputProps,
													endAdornment: (
														<>
															{loading ? (
																<CircularProgress color="inherit" size={20} />
															) : null}
															{params.InputProps.endAdornment}
														</>
													),
												}}
											/>
										)}
									/>

									<DataGrid
										dataSource={dataSourceInstrument}
										showBorders={true}
										columnAutoWidth={true}
										height={400}
										allowColumnResizing={true}
										columnResizingMode="widget"
										columnMinWidth={50}
										loadPanel={{
											enabled: true,
										}}
									>
										<SearchPanel
											visible={true}
											width={240}
											placeholder="Tìm kiếm công cụ & dụng cụ"
										/>
										<HeaderFilter visible={true} />
										<Editing mode="row" allowUpdating={true} allowDeleting={true} useIcons={true} />
										<Column
											dataField="InstrumentDeptId"
											caption="Mã chi tiết CC - DC"
											allowEditing={false}
											headerCellRender={data => renderHeader(data)}
										/>
										<Column
											dataField="DeviceId"
											caption="Mã CC - DC"
											allowEditing={false}
											headerCellRender={data => renderHeader(data)}
										/>
										<Column
											dataField="DeviceName"
											caption="Tên CC - DC"
											allowEditing={false}
											headerCellRender={data => renderHeader(data)}
										/>
										<Column
											dataField="Quantity"
											caption="Số lượng"
											allowEditing={true}
											dataType="number"
											headerCellRender={data => renderHeader(data)}
										>
											<RequiredRule />
										</Column>
										<Column
											caption="Phòng"
											dataField="LabId"
											allowEditing={false}
											headerCellRender={data => renderHeader(data)}
										/>
									</DataGrid>
								</Box>
							)}
						></TabItem>
					</TabPanel>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button autoFocus color="error" onClick={onClose}>
					Hủy
				</Button>
				<Button color="info" onClick={handleConfirm}>
					Xác nhận
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DialogLiquidate;
