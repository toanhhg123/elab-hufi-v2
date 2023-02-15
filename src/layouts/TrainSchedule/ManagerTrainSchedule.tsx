import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DataGrid, {
	Button as DevButtonGrid,
	Column,
	ColumnChooser,
	ColumnFixing,
	FilterPanel,
	FilterRow,
	Grouping,
	HeaderFilter,
	Item,
	Lookup,
	Pager,
	Paging,
	Toolbar,
} from 'devextreme-react/data-grid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
	Autocomplete,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	IconButton,
	Input,
	InputLabel,
	TextField,
} from '@mui/material';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import _, { uniqueId } from 'lodash';
import { useAppSelector } from '../../hooks';
import { deleteTrainSchedule, getTrainSchedules, updateTrainSchedules } from '../../services/trainServices';
import { ITrainSchedule, ITrainScheduleDeviceItem } from '../../types/trainType';
import { renderHeader } from '../DepartmentTable/Dialog/DialogImportDeviceInfo';
import { ColumnSizeType, ColumnsType, DialogProps } from '../DepartmentTable/Dialog/DialogType';
import resultData from './ResultData.json';

const ManagerTrainSchedule = () => {
	const dataGridRef = useRef<DataGrid<any, any> | null>(null);
	const [managerTrainSchedule, setManagerTrainSchedule] = useState<ITrainSchedule[]>([]);
	const [initDataDialog, setInitDataDialog] = useState<ITrainSchedule | null>(null);
	const [openDialog, setOpenDialog] = useState<{ isOpen: boolean; type: string }>({ isOpen: false, type: 'INFO' });

	const getTrainSchedulesData = async () => {
		const listOfTrainSchedule: ITrainSchedule[] = await getTrainSchedules();
		if (Array.isArray(listOfTrainSchedule)) {
			setManagerTrainSchedule(listOfTrainSchedule);
		}
	};

	useEffect(() => {
		if (managerTrainSchedule.length === 0) {
			getTrainSchedulesData();
		}
	}, []);

	const dataSource = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: managerTrainSchedule.map(x => ({ ...x, Id: uniqueId('TrainSchedule_') })),
				key: 'Id',
			}),
		});
	}, [managerTrainSchedule]);

	const handleDelete = async (row: any) => {
		try {
			const deleted: any = await deleteTrainSchedule(row?.key);
			if (deleted?.status !== 200 || deleted === undefined) {
				throw new Error();
			}
		} catch (err) {
			if (row?.data) {
				dataSource.store().insert(row?.data);
				dataSource.reload();
			}
		}
	};

	return (
		<>
			<h3 style={{ margin: '0px', textAlign: 'left', padding: '0.5rem' }}>
				<b>
					<KeyboardArrowRightIcon
						style={{ margin: '0px', fontSize: '30px', paddingTop: '15px' }}
					></KeyboardArrowRightIcon>
				</b>
				<span>Lịch tập huấn</span>
			</h3>
			<Box px={2} pb={5} height="100%">
				<DataGrid
					dataSource={dataSource}
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
					editing={{
						confirmDelete: true,
						allowDeleting: true,
						allowAdding: true,
						allowUpdating: true,
					}}
					onRowRemoving={row => {
						handleDelete(row);
					}}
					elementAttr={{ style: 'height: 100%; padding-bottom: 20px; width: 100%; min-width: 600px' }}
				>
					<ColumnChooser enabled={true} mode="select" />
					<Paging enabled={false} />
					<FilterRow visible={true} applyFilter={true} />
					<HeaderFilter visible={true} />
					<ColumnFixing enabled={false} />
					<Grouping contextMenuEnabled={true} expandMode="rowClick" />
					<FilterPanel visible={true}/>
					<Pager
						allowedPageSizes={true}
						showInfo={true}
						showNavigationButtons={true}
						showPageSizeSelector={true}
						visible={true}
					/>
					<Paging defaultPageSize={30} />

					<Column
						dataField="DeviceId"
						dataType="string"
						headerCellRender={data => renderHeader(data)}
						cellRender={row => <span>{`${row.data.DeviceId} - ${row.data.DeviceName}`}</span>}
						caption="Thiết bị"
					/>
					<Column
						dataField="DeviceName"
						dataType="string"
						visible={false}
						headerCellRender={data => renderHeader(data)}
					/>
					<Column
						dataField="TrainerId"
						dataType="string"
						headerCellRender={data => renderHeader(data)}
						cellRender={row => (
							<span>{row.data.TrainerId && `${row.data.TrainerId} - ${row.data.TrainerName}`}</span>
						)}
						caption="Người hướng dẫn tập huấn"
					/>
					<Column
						dataField="TrainerName"
						dataType="string"
						visible={false}
						headerCellRender={data => renderHeader(data)}
					/>
					<Column type="buttons">
						<DevButtonGrid
							icon="edit"
							onClick={(e: any) => {
								setOpenDialog({ isOpen: true, type: 'EDIT' });
								setInitDataDialog(e.row.data);
							}}
						/>
						<DevButtonGrid
							icon="info"
							onClick={(e: any) => {
								setOpenDialog({ isOpen: true, type: 'INFO' });
								setInitDataDialog(e.row.data);
							}}
						/>
					</Column>
					<Toolbar>
						<Item name="columnChooserButton" />
						<Item name="searchPanel" showText="always" />
					</Toolbar>
				</DataGrid>
			</Box>

			{openDialog.isOpen && (
				<DetailTrainSchedule
					isOpen={openDialog.isOpen}
					onClose={() => setOpenDialog({ isOpen: false, type: 'INFO' })}
					type={openDialog.type}
					data={initDataDialog}
					getTrainSchedulesData={getTrainSchedulesData}
				/>
			)}
		</>
	);
};

const DetailTrainSchedule = ({
	isOpen,
	onClose,
	data,
	type,
	getTrainSchedulesData,
}: DialogProps & { data: ITrainSchedule | null; type: string; getTrainSchedulesData: () => Promise<void> }) => {
	const dataGridRef = useRef<DataGrid<any, any> | null>(null);
	const [trainSchedule, setTrainSchedule] = useState<ITrainSchedule | null>(null);
	const trainInstructors = useAppSelector(state => state.managerTrainSchedule.listOfTrainInstructor);
	const trainer = useAppSelector(state => state.managerTrainSchedule.listOfTrainer);
	const [updateTrains, setUpdateTrains] = useState<ITrainScheduleDeviceItem[]>([]);
	const [deleteTrains, setDeleteTrains] = useState<Number[]>([]);

	function isTrainScheduleDevice(obj: any): obj is ITrainScheduleDeviceItem {
		if (obj !== null) return 'ResultId' in obj && 'ResearcherId' in obj && 'InstructorId' in obj;
		return false;
	}

	useEffect(() => {
		if (
			data !== null &&
			Array.isArray(data.listTrainSchedule) &&
			data.listTrainSchedule.length > 0 &&
			isTrainScheduleDevice(data.listTrainSchedule[0])
		) {
			setTrainSchedule(data);
		}
	}, [data]);

	const columns = useRef<(ColumnsType & { colSize: ColumnSizeType; required?: boolean; readonly?: boolean })[]>([
		{
			id: 'DeviceName',
			header: 'Thiết bị',
			colSize: {
				xs: 12,
				sm: 6,
			},
			readonly: true,
		},
		{
			id: 'TrainerName',
			header: 'Người hướng dẫn tập huấn',
			colSize: {
				xs: 12,
				sm: 6,
			},
			readonly: type === 'INFO' ? true : false,
		},
	]);

	const dataSourceTrain = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: trainSchedule?.listTrainSchedule
					? JSON.parse(
							JSON.stringify(
								trainSchedule.listTrainSchedule.map(x => ({
									...x,
									TrainDate: x.TrainDate ? Number(x.TrainDate) * 1000 : null,
								})),
							),
					  )
					: [],
				key: 'ResultId',
			}),
		});
	}, [trainSchedule]);

	const handleDebouncedInput = _.debounce((key: string, value: string) => {
		setTrainSchedule(prev => {
			if (prev !== null) {
				return {
					...prev,
					[key]: value,
				};
			}
			return null;
		});
	}, 200);

	const renderInfo = useCallback(() => {
		return (
			<>
				{columns.current.map(col => {
					if (type === 'EDIT' && col.id === 'TrainerName') {
						return (
							<Grid item {...col.colSize} key={col.id}>
								<Autocomplete
									options={trainer}
									getOptionLabel={option => `${option.TrainerId} - ${option.TrainerName}`}
									id={col.id}
									renderInput={params => (
										<TextField {...params} label={col.header} variant="standard" />
									)}
									onChange={(e, value) => {
										setTrainSchedule(prev => {
											if (prev !== null) {
												return {
													...prev,
													...value,
												};
											}
											return null;
										});
									}}
									defaultValue={
										trainSchedule !== null
											? {
													TrainerId: trainSchedule?.TrainerId || '',
													TrainerName: trainSchedule?.TrainerName || '',
											  }
											: {
													TrainerId: '',
													TrainerName: '',
											  }
									}
								/>
							</Grid>
						);
					}

					return (
						<Grid item {...col.colSize} key={col.id}>
							<FormControl variant="standard" fullWidth>
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
									defaultValue={
										trainSchedule !== null
											? `${trainSchedule[col.id as keyof typeof trainSchedule] || ' '}`
											: ' '
									}
								/>
							</FormControl>
						</Grid>
					);
				})}
			</>
		);
	}, [trainSchedule]);

	const handleSaveGrid = (row: any) => {
		let updated: ITrainScheduleDeviceItem[] = [];
		let deleted: Number[] = [];

		row.changes
			.filter((x: any) => x?.type === 'update')
			.forEach((change: any) => {
				if (isTrainScheduleDevice(change?.data)) {
					updated.push(change?.data);
				}
			});

		row.changes
			.filter((x: any) => x?.type === 'remove')
			.forEach((change: any) => {
				if (change?.key) {
					deleted.push(change.key);
				}
			});

		let listUpdatedId: Number[] = updated.map(x => x.ResultId);

		setUpdateTrains(prev => {
			return [...prev.filter(x => !listUpdatedId.includes(x.ResultId)), ...updated];
		});
		setDeleteTrains(prev => [...prev, ...deleted]);
	};

	return (
		<>
			<Dialog
				open={isOpen}
				onClose={onClose}
				PaperProps={{ style: { maxWidth: 'unset', height: 'calc(100vh - 80px)' } }}
			>
				<DialogTitle textAlign="left">
					{type === 'INFO' && <b>Thông tin đăng ký tập huấn</b>}
					{type === 'EDIT' && <b>Sửa đăng ký tập huấn</b>}

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
					<Box px={2} display="flex" flexDirection="column" height="100%" overflow="hidden">
						<Grid container spacing={2} mb={2}>
							{trainSchedule && renderInfo()}
						</Grid>
						<div id="data-grid" style={{ height: '100%', width: '100%', overflowX: 'auto' }}>
							<DataGrid
								dataSource={dataSourceTrain}
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
									allowDeleting: type !== 'INFO',
									allowAdding: type !== 'INFO',
									allowUpdating: type !== 'INFO',
									mode: 'form',
								}}
								elementAttr={{
									style: 'height: 100%; padding-bottom: 20px; width: 100%; min-width: 800px',
								}}
								onSaved={handleSaveGrid}
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
									allowEditing={false}
									dataField="ResearcherId"
									dataType="string"
									caption="Mã nghiên cứu sinh"
									headerCellRender={data => renderHeader(data)}
								/>
								<Column
									allowEditing={false}
									dataField="ResearcherName"
									dataType="string"
									caption="Tên nghiên cứu sinh"
									headerCellRender={data => renderHeader(data)}
								/>
								<Column
									allowEditing={false}
									dataField="InstructorName"
									dataType="string"
									caption="Người hướng dẫn"
									headerCellRender={data => renderHeader(data)}
								/>
								<Column
									dataField="TrainDate"
									dataType="date"
									headerCellRender={data => renderHeader(data)}
									format="dd/MM/yyyy"
									caption="Ngày tập huấn"
									setCellValue={(newData: any, value: any, currentRowData: any) => {
										newData.TrainDate = Number(value);
									}}
								/>
								<Column
									dataField="TrainTime"
									dataType="number"
									caption="Thời gian tập huấn"
									headerCellRender={data => renderHeader(data)}
								/>
								<Column
									dataField="Result"
									dataType="string"
									caption="Kết quả đăng ký"
									headerCellRender={data => renderHeader(data)}
								>
									<Lookup dataSource={resultData} displayExpr="Result" valueExpr="Result" />
								</Column>
								<Column
									dataField="Note"
									dataType="string"
									caption="Ghi chú"
									headerCellRender={data => renderHeader(data)}
								/>
								{type !== 'INFO' && (
									<Column type="buttons">
										<DevButtonGrid icon="edit" name="edit" />
										<DevButtonGrid icon="trash" name="delete" />
									</Column>
								)}
								<Toolbar>
									<Item name="columnChooserButton" />
									<Item name="searchPanel" showText="always" />
								</Toolbar>
							</DataGrid>
						</div>
					</Box>
				</DialogContent>
				{type !== 'INFO' && (
					<DialogActions>
						<Button autoFocus color="error" onClick={onClose}>
							Hủy
						</Button>
						<Button
							color="info"
							onClick={async () => {
								try {
									if (trainSchedule !== null) {
										await updateTrainSchedules([
											{
												...trainSchedule,
												listTrainSchedule: updateTrains.map(x => ({
													...x,
													TrainDate: x.TrainDate
														? `${Math.floor(Number(x.TrainDate) / 1000)}`
														: null,
												})),
											},
										]);

										if (deleteTrains.length > 0) {
											await deleteTrainSchedule({
												...trainSchedule,
												listTrainSchedule: deleteTrains.map(x => ({
													ResultId: x,
													InstructorId: '',
													InstructorName: '',
													Note: '',
													ResearcherId: '',
													ResearcherName: '',
													Result: '',
													TrainDate: '',
													TrainTime: 0,
												})),
											});
										}
									}
								} catch (err) {
								} finally {
									getTrainSchedulesData();
								}
							}}
						>
							Xác nhận
						</Button>
					</DialogActions>
				)}
			</Dialog>
		</>
	);
};

export default ManagerTrainSchedule;
