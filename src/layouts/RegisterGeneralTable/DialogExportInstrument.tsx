import Add from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
	Autocomplete,
	Box,
	Button,
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
	SearchPanel,
	Toolbar,
} from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { colorsNotifi } from '../../configs/color';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setSnackbar } from '../../pages/appSlice';
import {
	deleteExportInstrumentResearchs,
	getExportInstrumentResearchs,
	getInstruments,
	postExportInstrumentResearchs,
	updateExportInstrumentResearchs,
} from '../../services/exportInstrumentResearchServices';
import {
	dummyExportInstrumentResearch,
	IExportInstrumentResearch,
	IExportInstrumentResearchItem,
} from '../../types/exportInstrumentResearchType';
import { renderHeader } from '../DepartmentTable/Dialog/DialogImportDeviceInfo';
import { ColumnSizeType, DialogProps, ErrorType } from '../DepartmentTable/Dialog/DialogType';
import { ColumnType } from './Utils';

const userLogin = {
	EmployeeIdCreate: '02003019',
	EmployeeNameCreate: 'Dương Thị Ngọc Hân',
	EmployeeIdReceive: '02003020',
	EmployeeNameReceive: 'Nguyễn Thị Thu Hà',
	DepartmentId: 2,
	DepartmentName: 'Khoa Công nghệ thực phẩm',
};

function DialogExportInstrument({ isOpen, onClose }: DialogProps) {
	const dataGridRef = useRef<DataGrid<any, any> | null>(null);
	const [exportResearchs, setExportResearchs] = useState<IExportInstrumentResearch[]>([]);
	const [openCreate, setOpenCreate] = useState<{ isOpen: boolean; type: string }>({ isOpen: false, type: 'POST' });
	const [initDataDialog, setInitDataDialog] = useState<IExportInstrumentResearch | null>(null);
	const dispatch = useAppDispatch();

	const getExportResearchs = async () => {
		const data: IExportInstrumentResearch[] = await getExportInstrumentResearchs(2);
		setExportResearchs([...data]);
	};

	function isExportInstrumentResearchs(obj: any): obj is IExportInstrumentResearchItem {
		if (obj !== null) return 'ExpResearchId' in obj && 'listInstrument' in obj && 'RegisterGeneralId' in obj;
		return false;
	}

	useEffect(() => {
		getExportResearchs();
	}, []);

	const dataSourceExport = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: exportResearchs,
				key: 'ExpResearchId',
			}),
		});
	}, [exportResearchs]);

	const handleDelete = async (row: any) => {
		try {
			if (isExportInstrumentResearchs(row?.data)) {
				const deleted: any = await deleteExportInstrumentResearchs(row?.data.ExpResearchId);
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
			}
		} catch (err) {
			if (row?.data) {
				dataSourceExport.store().insert(row?.data);
				dataSourceExport.reload();
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
				<b>Xuất dụng cụ cho giảng viên nghiên cứu khoa học/hướng dẫn khoá luận</b>

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
							dataSource={dataSourceExport}
							ref={dataGridRef}
							id="gridContainer"
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
							loadPanel={{
								enabled: true,
							}}
							editing={{
								confirmDelete: true,
								allowDeleting: true,
							}}
							onRowRemoving={row => {
								handleDelete(row);
							}}
							elementAttr={{ style: 'height: 100%; padding-bottom: 20px; width: 100%; min-width: 800px' }}
						>
							<ColumnChooser enabled={true} mode="select" />
							<Paging enabled={false} />
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

							<Column dataField="ExpResearchId" caption="Mã xuất" />
							<Column
								dataField="ExportDate"
								caption="Ngày xuất"
								cellRender={data => <span>{moment.unix(Number(data.text)).format('DD/MM/YYYY')}</span>}
							/>
							<Column dataField="Content" caption="Nội dung" />
							<Column
								dataField="EmployeeNameCreate"
								caption="Người tạo phiếu"
								cellRender={data => (
									<span>{`${data?.data?.EmployeeIdCreate || ''} - ${data.text || ''}`}</span>
								)}
							/>
							<Column
								dataField="InstructorName"
								caption="Người nhận"
								cellRender={data => (
									<span>{`${data?.data?.InstructorId || ''} - ${data.text || ''}`}</span>
								)}
							/>
							<Column dataField="DepartmentName" caption="Khoa" />
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
							<MasterDetail enabled={true} component={ExportDetail} />
						</DataGrid>
					</div>

					{openCreate.isOpen && (
						<DialogCreate
							isOpen={openCreate.isOpen}
							type={openCreate.type}
							getData={getExportResearchs}
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
}

const ExportDetail = (props: any) => {
	const [listInstrument, setListInstrument] = useState<IExportInstrumentResearchItem[]>([]);

	function isInstrument(obj: any): obj is IExportInstrumentResearchItem {
		if (obj !== null) return 'InstrumentDeptId' in obj && 'Quantity' in obj && 'DeviceId' in obj;
		return false;
	}

	useEffect(() => {
		if (
			Array.isArray(props?.data?.data?.listInstrument) &&
			props?.data?.data?.listInstrument.length > 0 &&
			isInstrument(props?.data?.data?.listInstrument[0])
		) {
			setListInstrument(props?.data?.data?.listInstrument || []);
		}
	}, [props]);

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
			<Box>
				<DataGrid
					dataSource={dataSourceInstrument}
					showBorders={true}
					columnAutoWidth={true}
					allowColumnResizing={true}
					columnResizingMode="widget"
					columnMinWidth={50}
				>
					<SearchPanel visible={true} width={240} placeholder="Tìm kiếm" />

					<FilterRow visible={true} applyFilter={true} />
					<HeaderFilter visible={true} />
					<Column
						dataField="InstrumentDeptId"
						headerCellRender={data => renderHeader(data)}
						caption="Mã công cụ - dụng cụ"
					/>
					<Column dataField="DeviceId" visible={false} headerCellRender={data => renderHeader(data)} />
					<Column
						dataField="DeviceName"
						caption="Tên công cụ - dụng cụ"
						headerCellRender={data => renderHeader(data)}
					/>
					<Column dataField="Quantity" caption="Số lượng" headerCellRender={data => renderHeader(data)} />
					<Column dataField="LabId" caption="Mã Phòng" headerCellRender={data => renderHeader(data)} />
					<Toolbar>
						<Item location="before">
							<Typography variant="button" display="block" gutterBottom>
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

const DialogCreate = ({
	isOpen,
	onClose,
	getData,
	data,
	type,
}: DialogProps & { data: IExportInstrumentResearch | {}; getData: () => Promise<void>; type: string }) => {
	const registerGenerals = useAppSelector(state => state.registerGeneral.listOfRegisterGenerals);
	const [errors, setErrors] = useState<ErrorType[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [listInstrument, setListInstrument] = useState<IExportInstrumentResearchItem[]>([]);
	const [selectedInstruments, setSelectedInstruments] = useState<IExportInstrumentResearchItem[]>([]);
	const [exportResearch, setExportResearch] = useState<IExportInstrumentResearch>({
		...dummyExportInstrumentResearch,
		...userLogin,
		...data,
	});
	const dispatch = useAppDispatch();
	const [openAutocomplete, setOpenAutocomplete] = useState<{ device: boolean; instrument: boolean }>({
		device: false,
		instrument: false,
	});
	const columns = useRef<(ColumnType & { colSize: ColumnSizeType; required?: boolean; readonly?: boolean })[]>([
		{ id: 'ExpResearchId', header: 'Mã xuất', colSize: { xs: 12, sm: 6 }, required: true },
		{ id: 'ExportDate', header: 'Ngày xuất', type: 'date', colSize: { xs: 12, sm: 6 }, required: true },
		{ id: 'EmployeeNameCreate', header: 'Người tạo', colSize: { xs: 12, sm: 6 }, required: true, readonly: true },
		{ id: 'RegisterGeneralId', header: 'Bài nghiên cứu', colSize: { xs: 12, sm: 6 }, required: true },
		{ id: 'DepartmentName', header: 'Khoa', colSize: { xs: 12, sm: 6 }, required: true, readonly: true },
		{ id: 'InstructorName', header: 'Người nhận', colSize: { xs: 12, sm: 6 }, required: true, readonly: true },
		{ id: 'Content', header: 'Nội dung', colSize: { xs: 12, sm: 12 } },
	]);

	useEffect(() => {
		(async () => {
			try {
				let listInstrument: IExportInstrumentResearchItem[] = await getInstruments(2);
				setListInstrument(listInstrument);
			} catch (err) {
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleDebouncedInput = _.debounce((key: string, value: string) => {
		setExportResearch(prev => ({
			...prev,
			[key]: value,
		}));
	}, 200);

	useEffect(() => {
		setListInstrument(prev => {
			return prev.filter(
				x => selectedInstruments.findIndex(s => s.InstrumentDeptId === x.InstrumentDeptId) === -1,
			);
		});
	}, [selectedInstruments]);

	const dataSourceInstrument = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: [...exportResearch.listInstrument, ...selectedInstruments],
				key: 'InstrumentDeptId',
			}),
		});
	}, [selectedInstruments]);

	const renderInfo = () => {
		return columns.current.map(col => {
			let indexError = errors.findIndex(err => err.id === col.id);
			if (col.id === 'InstructorName') {
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
							<Input id={col.id} disabled value={exportResearch.InstructorName} defaultValue=" " />
							{indexError !== -1 && <FormHelperText>{errors[indexError].msg}</FormHelperText>}
						</FormControl>
					</Grid>
				);
			}

			if (col.id === 'RegisterGeneralId') {
				return (
					<Grid item {...col.colSize} key={col.id}>
						<Autocomplete
							id="registerGenerals-autocomplete"
							options={registerGenerals}
							isOptionEqualToValue={(option, value) =>
								option.RegisterGeneralId === value.RegisterGeneralId
							}
							getOptionLabel={option =>
								`${option.ResearcherId} - ${option.ResearcherName} - ${option.ResearchSubject}`
							}
							renderInput={params => (
								<TextField {...params} variant="standard" label="Chọn bài nghiên cứu" />
							)}
							onChange={(e, value) => {
								setExportResearch(prev => ({
									...prev,
									RegisterGeneralId: Number(value?.RegisterGeneralId || 0),
									InstructorId: value?.InstructorId || '',
									InstructorName: value?.InstructorName || '',
								}));
							}}
						/>
						{indexError !== -1 && <FormHelperText>{errors[indexError].msg}</FormHelperText>}
					</Grid>
				);
			}
			if (col.type === 'date') {
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
										Number(exportResearch[col.id as keyof typeof exportResearch]) * 1000,
									).toLocaleDateString('en-CA') !== '1970-01-01'
										? new Date(
												Number(exportResearch[col.id as keyof typeof exportResearch]) * 1000,
										  ).toLocaleDateString('en-CA')
										: new Date().toLocaleDateString('en-CA')
								}
								onChange={e => handleDebouncedInput(col.id, `${Number(new Date('2023-10-09')) / 1000}`)}
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
							defaultValue={exportResearch[col.id as keyof typeof exportResearch]}
						/>
						{indexError !== -1 && <FormHelperText>{errors[indexError].msg}</FormHelperText>}
					</FormControl>
				</Grid>
			);
		});
	};

	const handleConfirm = async () => {
		let postData: IExportInstrumentResearch = {
			...exportResearch,
			listInstrument: dataSourceInstrument.items(),
		};

		let errorList: ErrorType[] = [];

		columns.current.forEach(col => {
			if (`${postData[col.id as keyof typeof postData]}`.trim() === '' && col.required) {
				errorList.push({ id: col.id, msg: `${col.header} là bắt buộc` });
			}
		});

		if (postData.listInstrument.length === 0) {
			dispatch(
				setSnackbar({
					message: 'Danh sách công cụ - dụng cụ không được để trống!!!',
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
						const postRes = await postExportInstrumentResearchs(postData);

						if (Object.keys(postRes).length > 0) {
							dispatch(
								setSnackbar({
									message: 'Thêm thành công',
									color: colorsNotifi['success'].color,
									backgroundColor: colorsNotifi['success'].background,
								}),
							);
							getData();
						} else {
							throw new Error();
						}
						break;
					}
					case 'PUT': {
						const postRes = await updateExportInstrumentResearchs({
							...postData,
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
							getData();
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

	return (
		<Dialog open={isOpen} onClose={onClose} PaperProps={{ style: { maxWidth: 'unset' } }}>
			<DialogTitle textAlign="left">
				{type === 'POST' && <b>Thêm phiếu xuất dụng cụ</b>}
				{type === 'PUT' && <b>Sửa phiếu xuất dụng cụ</b>}

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
							isOptionEqualToValue={(option, value) => option.InstrumentDeptId === value.InstrumentDeptId}
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
												{loading ? <CircularProgress color="inherit" size={20} /> : null}
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
						>
							<SearchPanel visible={true} width={240} placeholder="Tìm kiếm công cụ & dụng cụ" />
							<HeaderFilter visible={true} />
							<Editing mode="row" allowUpdating={true} allowDeleting={true} useIcons={true} />
							<Column
								dataField="InstrumentDeptId"
								caption="Mã công cụ - dụng cụ"
								allowEditing={false}
								headerCellRender={data => renderHeader(data)}
							/>
							<Column
								dataField="DeviceId"
								visible={false}
								allowEditing={false}
								headerCellRender={data => renderHeader(data)}
							/>
							<Column
								dataField="DeviceName"
								caption="Tên công cụ - dụng cụ"
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
								dataField="LabId"
								caption="Mã Phòng"
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

export default DialogExportInstrument;
