import CloseIcon from '@mui/icons-material/Close'
import {
	AppBar,
	Box,
	Button,
	Dialog,
	DialogContent,
	IconButton,
	Toolbar,
	Typography
} from '@mui/material'

import DataGrid, {
	Column,
	Editing,
	Paging,
	Selection
} from 'devextreme-react/data-grid'
import ArrayStore from 'devextreme/data/array_store'
import DataSource from 'devextreme/data/data_source'
import { useMemo, useRef, useState } from 'react'
import { useAppDispatch } from '../../../hooks'
import { setSnackbarMessage } from '../../../pages/appSlice'
import { postDevice } from '../../../services/deviceServices'
import { dummyDeviceDepartmentData } from '../../../types/deviceDepartmentType'
import { DialogProps } from './DialogType'

const DialogCreate = ({ isOpen, onClose }: DialogProps) => {
	const [createdRow, setCreatedRow] = useState<any>([dummyDeviceDepartmentData])
	const dispatch = useAppDispatch()
	const dataGridRef = useRef<DataGrid<any, any> | null>(null)

	const submit = async () => {
		await dataGridRef.current?.instance.saveEditData();
		
	}

	const handleClose = () => {
		setCreatedRow([dummyDeviceDepartmentData])
		onClose()
	}

	const dataSource = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: [],
				key: 'Id',
			}),
		})
	}, [])

	return (
		<Dialog fullScreen open={isOpen} onClose={handleClose}>
			<AppBar sx={{ position: 'relative', overflow: 'auto' }}>
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
						<CloseIcon />
					</IconButton>
					<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
						<b>Tạo thông tin thiết bị mới</b>
					</Typography>
					<Button autoFocus color="inherit" onClick={submit}>
						Tải lên
					</Button>
				</Toolbar>
			</AppBar>
			<DialogContent sx={{ overflow: 'auto' }}>
				<Box px={2} pb={5} height="100%">
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
						editing={{
							confirmDelete: true,
							allowDeleting: true,
							allowAdding: true,
							allowUpdating: true,
							mode: 'batch',
						}}
						elementAttr={{ style: 'height: 100%; padding-bottom: 20px; width: 100%; min-width: 600px' }}
					>
						<Selection mode="multiple" selectAllMode="page" showCheckBoxesMode="always" />
						<Paging enabled={true} />
						<Editing mode="row" allowUpdating={true} allowDeleting={true} allowAdding={true} />
						<Column dataField="DeviceId" caption="Mã thiết bị" />
						<Column dataField="DeviceName" caption="Tên thiết bị" />
						<Column dataField="DeviceEnglishName" caption="Tên tiếng anh" />
					</DataGrid>
				</Box>
			</DialogContent>
		</Dialog>
	)
}

export default DialogCreate
