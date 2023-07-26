import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import {
	Box,
	Button,
	ButtonGroup,
	Checkbox,
	CircularProgress,
	debounce,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	IconButton,
	InputAdornment,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material'

import _ from 'lodash'
import moment from 'moment'
import { useEffect, useRef, useState, useMemo } from 'react'
import { colorsNotifi } from '../../../configs/color'
import { useAppDispatch } from '../../../hooks'
import { setSnackbar } from '../../../pages/appSlice'
import {
	deleteMaintenanceDevice,
	getMaintenanceDeviceById,
	postMaintenanceDevice,
	updateMaintenanceDevice,
} from '../../../services/maintenanceDevicesServices'
import { dummyRepairDeviceItem, IRepairDevice, IRepairDeviceItem } from '../../../types/maintenanceDevicesType'
import { descendingComparator, renderArrowSort } from '../../ChemicalWarehouseTable/Utils'
import { ProviderValueType, useDeviceOfDepartmentTableStore } from '../context/DeviceOfDepartmentTableContext'
import { removeAccents } from '../DeviceOfDepartmentTable'
import { ColumnsType, DialogProps } from './DialogType'
import { nestedObject } from './ultis'
import DataGrid, {
	Column,
	Paging,
	ColumnChooser,
	FilterRow,
	HeaderFilter,
	ColumnFixing,
	Grouping,
	FilterPanel,
	Pager,
	LoadPanel,
} from 'devextreme-react/data-grid'
import DataSource from 'devextreme/data/data_source'
import ArrayStore from 'devextreme/data/array_store'

const DialogMaintenanceDevice = ({
	isOpen,
	onClose,
	data,
	loading,
}: DialogProps & {
	data: IRepairDevice | null
	loading: boolean
}) => {
	const dataGridRef = useRef<DataGrid<any, any> | null>(null)
	const dataSource = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: [],
				key: 'Id',
			}),
		})
	}, [])

	return (
		<Dialog open={isOpen} onClose={onClose} PaperProps={{ style: { width: '800px', maxWidth: 'unset' } }}>
			<DialogTitle textAlign="left">
				<b>Lịch sử sửa chữa - hiệu chuẩn/bảo trì</b>

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
				{!loading ? (
					<>
						<DataGrid
							dataSource={dataSource}
							ref={dataGridRef}
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
							elementAttr={{ style: 'height: 100%; padding-bottom: 20px; width: 100%; min-width: 600px' }}
						>
							<ColumnChooser enabled={true} mode="select" />
							<Paging enabled={false} />
							<FilterRow visible={true} applyFilter={true} />
							<HeaderFilter visible={true} />
							<ColumnFixing enabled={false} />
							<Grouping contextMenuEnabled={true} expandMode="rowClick" />
							<FilterPanel visible={true} />
							<Pager
								allowedPageSizes={true}
								showInfo={true}
								showNavigationButtons={true}
								showPageSizeSelector={true}
								visible={true}
							/>
							<LoadPanel enabled={true} />
							<Paging defaultPageSize={30} enabled={true} />
							<Column dataField="DateCreate" caption="Ngày tạo" />
							<Column dataField="DateComplete" caption="Ngày hoàn thành" />
							<Column dataField="Content" caption="Nội dung sửa chữa" />
							<Column dataField="Status" caption="Trạng thái" />
						</DataGrid>
					</>
				) : (
					<Box textAlign="center">
						<CircularProgress disableShrink />
					</Box>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default DialogMaintenanceDevice
