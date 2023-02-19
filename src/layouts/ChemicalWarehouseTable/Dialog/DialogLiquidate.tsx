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
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import _ from 'lodash';
import moment from 'moment';
import { colorsNotifi } from '../../../configs/color';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setSnackbar } from '../../../pages/appSlice';
import {
	deleteLiquidateDept,
	getLiquidateDept,
	getLiquidateDeptChemical,
	postLiquidateDept,
	updateLiquidateDept,
} from '../../../services/liquidateChemicalServices';
import {
	dummyLiquidateChemical,
	ILiquidateChemical,
	ILiquidateChemicalItem,
} from '../../../types/chemicalWarehouseType';
import { renderHeader } from '../../DepartmentTable/Dialog/DialogImportDeviceInfo';
import { ColumnSizeType, ColumnsType, DialogProps, ErrorType } from '../../DepartmentTable/Dialog/DialogType';

const DialogLiquidate = ({ isOpen, onClose }: DialogProps) => {
	const dataGridRef = useRef<DataGrid<any, any> | null>(null);
	const [liquidateDeptDevice, setLiquidateDeptDevice] = useState<ILiquidateChemical[]>([]);
	const [openCreate, setOpenCreate] = useState<{ isOpen: boolean; type: string }>({ isOpen: false, type: 'POST' });
	const id = 2;
	const [initDataDialog, setInitDataDialog] = useState<ILiquidateChemical | null>(null);
	const dispatch = useAppDispatch();

	const getLiquidateDeptChemicals = useCallback(async () => {
		let data: ILiquidateChemical[] = await getLiquidateDept(id);

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
		getLiquidateDeptChemicals();
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
				<b>Thanh lý hóa chất</b>

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
				<Box py={1} display="flex" flexDirection="column" height="100%" overflow="hidden">
					<div id="data-grid" style={{ height: '100%', width: '100%', overflowX: 'auto' }}>
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
								useIcons: true,
							}}
							loadPanel={{
								enabled: true,
							}}
							onRowRemoving={row => {
								handleDeleteLiquidate(row);
							}}
							elementAttr={{ style: 'height: 100%; padding-bottom: 20px; width: 100%; min-width: 800px' }}
						>
							<ColumnChooser enabled={true} mode="select" />
							<FilterRow visible={true} applyFilter={true} />
							<HeaderFilter visible={true} />
							<ColumnFixing enabled={true} />
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
							<Column type="buttons" fixed={true}>
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
							getLiquidateDept={getLiquidateDeptChemicals}
							onClose={() => {
								setOpenCreate(prev => ({ ...prev, isOpen: false }));
								getLiquidateDeptChemicals();
							}}
							data={initDataDialog || []}
						/>
					)}
				</Box>
			</DialogContent>
		</Dialog>
	);
};

const DetailTemplate = (props: any) => {
	const [listChemical, setListChemical] = useState<ILiquidateChemical[]>([]);

	function isLiquidateChemical(obj: any): obj is ILiquidateChemical {
		if (obj !== null) return 'ChemDeptId' in obj && 'ChemicalName' in obj && 'ChemicalId' in obj;
		return false;
	}

	useEffect(() => {
		if (
			Array.isArray(props?.data?.data?.listChemical) &&
			props?.data?.data?.listChemical.length > 0 &&
			isLiquidateChemical(props?.data?.data?.listChemical[0])
		) {
			setListChemical(props?.data?.data?.listChemical || []);
		}
	}, [props]);

	const dataSourceChemical = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: listChemical,
				key: 'ChemDeptId',
			}),
		});
	}, [listChemical]);

	return (
		<>
			<Box mb={2}>
				<DataGrid
					dataSource={dataSourceChemical}
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
						dataField="ChemDeptId"
						caption="Mã chi tiết hóa chất"
						headerCellRender={data => renderHeader(data)}
					/>
					<Column
						dataField="ChemicalId"
						caption="Mã hóa chất"
						headerCellRender={data => renderHeader(data)}
					/>
					<Column
						dataField="ChemicalName"
						caption="Tên hóa chất"
						headerCellRender={data => renderHeader(data)}
					/>
					<Column dataField="Amount" caption="Số lượng" headerCellRender={data => renderHeader(data)} />
					<Column dataField="Unit" caption="Đơn vị" headerCellRender={data => renderHeader(data)} />
					<Toolbar>
						<Item location="before">
							<Typography variant="button" display="block" mb={0}>
								<b>Hóa chất</b>
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
}: DialogProps & { data?: ILiquidateChemical | []; getLiquidateDept: () => Promise<void>; type: string }) => {
	const owner = useAppSelector(state => state.userManager.owner)
	const [liquidate, setLiquidate] = useState<ILiquidateChemical>({
		...dummyLiquidateChemical,
		EmployeeId: owner.EmployeeId || '',
		EmployeeName: owner.Fullname,
		DepartmentId: owner.DepartmentId,
		DepartmentName: owner.DepartmentName,
		...data,
	});

	const [openAutocomplete, setOpenAutocomplete] = useState<{ device: boolean; instrument: boolean }>({
		device: false,
		instrument: false,
	});
	const [loading, setLoading] = useState<boolean>(true);
	const [listChemical, setListChemical] = useState<ILiquidateChemicalItem[]>([]);
	const id = 2;
	const [selectedChemicals, setSelectedChemicals] = useState<ILiquidateChemicalItem[]>([]);
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
				let listChemical: ILiquidateChemicalItem[] = await getLiquidateDeptChemical(id);
				setListChemical(listChemical);
			} catch (err) {
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const dataSourceChemical = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: [...liquidate.listChemical, ...selectedChemicals],
				key: 'ChemDeptId',
			}),
		});
	}, [selectedChemicals]);

	useEffect(() => {
		setListChemical(prev => {
			return prev.filter(x => selectedChemicals.findIndex(s => s.ChemDeptId === x.ChemDeptId) === -1);
		});
	}, [selectedChemicals]);

	const handleConfirm = async () => {
		let postData: ILiquidateChemical = {
			...liquidate,
			Accept: 'Create New',
			UserAccept: null,
			listChemical: dataSourceChemical.items(),
		};

		let errorList: ErrorType[] = [];

		columns.current.forEach(col => {
			if (`${postData[col.id as keyof typeof postData]}`.trim() === '' && col.required) {
				errorList.push({ id: col.id, msg: `${col.header} là bắt buộc` });
			}
		});

		if (postData.listChemical.length === 0) {
			dispatch(
				setSnackbar({
					message: 'Danh sách hóa chất không được để trống!!!',
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
						const postRes = await updateLiquidateDept(postData);
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
				{type === 'POST' && <b>Thêm phiếu thanh lý hóa chất</b>}
				{type === 'PUT' && <b>Sửa phiếu thanh lý hóa chất</b>}

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
					<Box>
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
							isOptionEqualToValue={(option, value) => option.ChemDeptId === value.ChemDeptId}
							getOptionLabel={option =>
								`${option.ChemDeptId} - ${option.ChemicalId} - ${option.ChemicalName}`
							}
							options={listChemical}
							loading={loading}
							onChange={(e, value) => {
								if (value !== null) {
									setSelectedChemicals(prev => [...prev, { ...value, Amount: 0 }]);
								}
							}}
							renderInput={params => (
								<TextField
									{...params}
									inputProps={{
										...params.inputProps,
										value: '',
									}}
									label="Hóa chất..."
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
												{loading ? <CircularProgress color="inherit" size={20} /> : null}
												{params.InputProps.endAdornment}
											</>
										),
									}}
								/>
							)}
						/>

						<DataGrid
							dataSource={dataSourceChemical}
							showBorders={true}
							height={400}
							remoteOperations={true}
							columnAutoWidth={true}
							allowColumnResizing={true}
							columnResizingMode="widget"
							columnMinWidth={50}
						>
							<SearchPanel visible={true} width={240} placeholder="Tìm kiếm hóa chất" />
							<HeaderFilter visible={true} />
							<Scrolling mode="virtual" />
							<Editing allowUpdating={true} allowDeleting={true} mode="row" useIcons={true} />
							<Column
								dataField="ChemDeptId"
								caption="Mã chi tiết hóa chất"
								headerCellRender={data => renderHeader(data)}
								cssClass="bg-header-table"
								allowEditing={false}
							/>
							<Column
								dataField="ChemicalId"
								caption="Mã hóa chất"
								allowEditing={false}
								headerCellRender={data => renderHeader(data)}
							/>
							<Column
								dataField="ChemicalName"
								caption="Tên hóa chất"
								allowEditing={false}
								headerCellRender={data => renderHeader(data)}
							/>
							<Column
								dataField="Amount"
								caption="Số lượng"
								allowEditing={true}
								headerCellRender={data => renderHeader(data)}
							>
								<RequiredRule />
							</Column>
							<Column
								dataField="Unit"
								caption="Đơn vị"
								allowEditing={false}
								headerCellRender={data => renderHeader(data)}
							/>
						</DataGrid>
					</Box>
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
