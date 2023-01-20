import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box } from '@mui/material';
import DataGrid, {
    Button as DevButtonGrid,
    Column,
    ColumnChooser,
    ColumnFixing,
    Editing,
    FilterRow, Form, Grouping,
    HeaderFilter, Item, Lookup, Pager,
    Paging, Popup, Toolbar
} from 'devextreme-react/data-grid';
import { Item as FromItem } from 'devextreme-react/form';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { uniqueId } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { colorsNotifi } from '../../configs/color';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setSnackbar } from '../../pages/appSlice';
import {
    deleteTrainRegister, getTrainRegister,
    postTrainRegister,
    updateTrainRegister
} from '../../services/trainServices';
import { ITrainRegister } from '../../types/trainType';
import { renderHeader } from '../DepartmentTable/Dialog/DialogImportDeviceInfo';
import { ColumnSizeType, ColumnsType } from '../DepartmentTable/Dialog/DialogType';

const RegisterTrainSchedule = () => {
	const dataGridRef = useRef<DataGrid<any, any> | null>(null);
	const [registerTrainSchedule, setRegisterTrainSchedule] = useState<ITrainRegister | null>(null);
	const dispatch = useAppDispatch();
	const trainDevices = useAppSelector(state => state.managerTrainSchedule.listOfTrainDevice);
	const trainInstructors = useAppSelector(state => state.managerTrainSchedule.listOfTrainInstructor);
	const columns = useRef<(ColumnsType & { colSize: ColumnSizeType; required?: boolean; readonly?: boolean })[]>([
		{ id: 'ResearcherId', header: 'ResearcherId', colSize: { xs: 4 } },
		{ id: 'Fullname', header: 'Fullname', colSize: { xs: 4 } },
		{ id: 'Birthday', header: 'Birthday', colSize: { xs: 4 } },
		{ id: 'Gender', header: 'Gender', colSize: { xs: 4 } },
		{ id: 'Address', header: 'Address', colSize: { xs: 4 } },
		{ id: 'Email', header: 'Email', colSize: { xs: 4 } },
		{ id: 'PhoneNumber', header: 'PhoneNumber', colSize: { xs: 4 } },
		{ id: 'Organization', header: 'Organization', colSize: { xs: 4 } },
	]);

	function isTrainRegister(obj: any): obj is ITrainRegister {
		if (obj !== null) return 'ResearcherId' in obj && 'listTrainDetail' in obj;
		return false;
	}

	const getTrainSchedulesData = async () => {
		const listOfTrainSchedule: ITrainRegister = await getTrainRegister('RS001');
		if (listOfTrainSchedule) {
			setRegisterTrainSchedule(listOfTrainSchedule);
		}
	};

	useEffect(() => {
		if (registerTrainSchedule === null) {
			getTrainSchedulesData();
		}
	}, []);

	const dataSource = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data:
					registerTrainSchedule !== null
						? registerTrainSchedule.listTrainDetail?.map(x => ({ ...x, Id: uniqueId('TrainSchedule_') }))
						: [],
				key: 'Id',
			}),
		});
	}, [registerTrainSchedule]);

	const handleDelete = async (row: any) => {
		try {
			const deleteData = { ...registerTrainSchedule, listTrainDetail: [row?.data] };
			if (isTrainRegister(deleteData)) {
				const deleted: any = await deleteTrainRegister(deleteData);
				if (deleted?.status !== 200 || deleted === undefined) {
					throw new Error();
				}
				await getTrainSchedulesData();
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

	const handleInsert = async (row: any) => {
		if (registerTrainSchedule === null) return;
		try {
			const postData: ITrainRegister = {
				...registerTrainSchedule,
				listTrainDetail: [
					{
						DeviceId: row.data?.DeviceId ? row.data?.DeviceId : '',
						InstructorId: row.data?.InstructorId ? row.data?.InstructorId : '',
						ResultId: 0,
					},
				],
			};

			const res = await postTrainRegister(postData);

			if (Object.keys(res).length === 0) {
				throw new Error();
			}

			dispatch(
				setSnackbar({
					message: 'Thêm thành công',
					color: colorsNotifi['success'].color,
					backgroundColor: colorsNotifi['success'].background,
				}),
			);
		} catch (error) {
			dispatch(
				setSnackbar({
					message: 'Đã xảy ra lỗi!!!',
					color: colorsNotifi['error'].color,
					backgroundColor: colorsNotifi['error'].background,
				}),
			);
		} finally {
			await getTrainSchedulesData();
		}
	};

	const handleUpdate = async (row: any) => {
		if (registerTrainSchedule === null) return;
		try {
			const updateData: ITrainRegister = {
				...registerTrainSchedule,
				listTrainDetail: [
					{
						ResultId: Number(row?.oldData.ResultId),
						DeviceId: row?.newData?.DeviceId ? row?.newData?.DeviceId : row?.oldData?.DeviceId,
						InstructorId: row?.newData?.InstructorId
							? row?.newData?.InstructorId
							: row?.oldData?.InstructorId,
					},
				],
			};

			const res = await updateTrainRegister(updateData);

			if (Object.keys(res).length === 0) {
				throw new Error();
			}

			dispatch(
				setSnackbar({
					message: 'Sửa thành công',
					color: colorsNotifi['success'].color,
					backgroundColor: colorsNotifi['success'].background,
				}),
			);
		} catch (error) {
			dispatch(
				setSnackbar({
					message: 'Đã xảy ra lỗi!!!',
					color: colorsNotifi['error'].color,
					backgroundColor: colorsNotifi['error'].background,
				}),
			);
		} finally {
			await getTrainSchedulesData();
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
				{/* <Grid container spacing={2} mb={2}>
					{columns.current.map(col => (
						<Grid item {...col.colSize}>
							<Box textAlign="left">
								<span>
									<>
										<b>{`${col.header}: `}</b>
										{registerTrainSchedule &&
											registerTrainSchedule[col.id as keyof typeof registerTrainSchedule]}
									</>
								</span>
							</Box>
						</Grid>
					))}
				</Grid> */}
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
					loadPanel={{
						enabled: true,
					}}
					onRowRemoving={handleDelete}
					onRowInserting={handleInsert}
					onRowUpdating={handleUpdate}
					onSaved={() => {
						console.log(dataSource.items());
					}}
					elementAttr={{ style: 'height: 100%; padding-bottom: 20px; width: 100%; min-width: 800px' }}
				>
					<ColumnChooser enabled={true} mode="select" />
					<Paging enabled={false} />
					<FilterRow visible={true} applyFilter={true} />
					<HeaderFilter visible={true} />
					<ColumnFixing enabled={false} />
					<Grouping contextMenuEnabled={true} expandMode="rowClick" />
					<Editing
						mode="popup"
						confirmDelete={true}
						allowUpdating={true}
						allowAdding={true}
						allowDeleting={true}
					>
						<Popup
							title="Thông tin đăng ký"
							showTitle={true}
							height="auto"
							width="auto"
							minWidth={500}
							maxWidth={700}
						/>
						<Form>
							<FromItem itemType="group" colCount={1} colSpan={2}>
								<FromItem dataField="DeviceId" />
								<FromItem dataField="InstructorId" />
								{/* <FromItem dataField="TrainDate" />
								<FromItem dataField="TrainTime" /> */}
							</FromItem>
						</Form>
					</Editing>
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
						caption="Thiết bị"
						dataType="string"
						headerCellRender={data => renderHeader(data)}
					>
						<Lookup dataSource={trainDevices} displayExpr="DeviceName" valueExpr="DeviceId" />
					</Column>
					<Column
						dataField="InstructorId"
						caption="Người hướng dẫn"
						dataType="string"
						headerCellRender={data => renderHeader(data)}
					>
						<Lookup dataSource={trainInstructors} displayExpr="InstructorName" valueExpr="InstructorId" />
					</Column>
					<Column
						dataField="TrainDate"
						caption="Ngày tập huấn"
						headerCellRender={data => renderHeader(data)}
						cellRender={data => (
							<span>{Number(data.text) ? moment.unix(Number(data.text)).format('DD/MM/YYYY') : ''}</span>
						)}
					/>
					<Column
						dataField="TrainTime"
						dataType="number"
						headerCellRender={data => renderHeader(data)}
						caption="Thời gian tập huấn"
					/>
					<Column
						dataField="Result"
						allowEditing={false}
						dataType="string"
						caption="Kết quả đăng ký"
						headerCellRender={data => renderHeader(data)}
					/>
					<Column
						dataField="TrainerId"
						allowEditing={false}
						dataType="string"
						caption="Người hướng dẫn tập huấn"
						headerCellRender={data => renderHeader(data)}
					>
						<Lookup dataSource={trainInstructors} displayExpr="InstructorName" valueExpr="InstructorId" />
					</Column>
					<Column type="buttons">
						<DevButtonGrid
							icon="edit"
							name="edit"
							visible={(e: any) => e.row.data.Result === 'Đã tập huấn'}
						/>
						<DevButtonGrid
							icon="trash"
							name="delete"
							visible={(e: any) => e.row.data.Result === 'Đã tập huấn'}
						/>
					</Column>
					<Toolbar>
						<Item name="columnChooserButton" />
						<Item name="addRowButton" />
						<Item name="searchPanel" showText="always" />
					</Toolbar>
				</DataGrid>
			</Box>
		</>
	);
};

export default RegisterTrainSchedule;
