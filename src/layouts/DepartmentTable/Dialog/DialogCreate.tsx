import { Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
	AppBar,
	Button,
	Dialog,
	DialogContent,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';

import { memo, useCallback, useState } from 'react';
import { useAppDispatch } from '../../../hooks';
import { setSnackbarMessage } from '../../../pages/appSlice';
import { postDevice } from '../../../services/deviceServices';
import { dummyDeviceDepartmentData } from '../../../types/deviceDepartmentType';
import { columns, DeviceColumnType, DialogProps, RowCreateDeviceProps } from './DialogType';

const RowCreateDevice = memo(({ field, indexField, handleFormChange, removeFields }: RowCreateDeviceProps) => {
	return (
		<>
			{columns?.map((column: DeviceColumnType, index: number) => {
				if (column?.type === 'select') {
					const list = column.data;

					return (
						<FormControl sx={{ m: 0, width: `${column.size}px` }} key={column.id}>
							<InputLabel>{column.header}</InputLabel>
							<Select
								value={
									list?.findIndex((x: any) => x === field[column.id]) > -1
										? list?.findIndex((x: any) => x === field[column.id]).toString()
										: ''
								}
								name={column.id}
								label={column.header}
								onChange={(e: SelectChangeEvent) =>
									handleFormChange(e, list[Number(e.target.value)], indexField)
								}
							>
								{list.map((x: any, idx: number) => (
									<MenuItem key={idx} value={idx}>
										{x}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					);
				} else {
					let style = {};
					if (column.sx) style = column.sx;

					return (
						<TextField
							key={index}
							label={column.header}
							name={column.id}
							sx={{
								maxWidth: column.size !== -1 ? `${column.size}px` : 'auto',
								flex: column.size === -1 ? 1 : '',
								...style,
							}}
							// defaultValue={column.id && field[column.id]}
							value={column.id && field[column.id]}
							onChange={e => handleFormChange(e, e.target.value, indexField)}
						/>
					);
				}
			})}
			<Tooltip arrow placement="right" title="Xoá hàng">
				<IconButton color="error" onClick={() => removeFields(indexField)}>
					<Delete />
				</IconButton>
			</Tooltip>
		</>
	);
});

const DialogCreate = ({ isOpen, onClose }: DialogProps) => {
	const [createdRow, setCreatedRow] = useState<any>([dummyDeviceDepartmentData]);
	const dispatch = useAppDispatch();

	const handleFormChange = useCallback(
		(event: any, value: any, index: number) => {
			const newArray = createdRow.map((item: any, i: number) => {
				if (index === i) {
					return { ...item, [event.target.name]: value };
				} else {
					return item;
				}
			});
			setCreatedRow(newArray);
		},
		[createdRow],
	);

	const addFields = useCallback(() => {
		setCreatedRow([...createdRow, dummyDeviceDepartmentData]);
	}, [createdRow]);

	const removeFields = (index: number) => {
		let data = createdRow.filter((x: any, i: number) => i !== index).map((item: any, i: number) => item);
		setCreatedRow(data);
	};

	const submit = async () => {
		const createData = createdRow
			.filter((x: any) => x.DeviceId !== '' && x.DeviceName !== '')
			.map((row: any) => {
				return {
					DeviceId: row.DeviceId,
					DeviceName: row.DeviceName,
					DeviceType: row.DeviceType,
					HasTrain: row.HasTrain === 'Có' ? 1 : 0,
					Standard: row.Standard,
					Unit: row.Unit,
				};
			});

		const res = await postDevice(createData);
		if (Object.keys(res).length !== 0) {
			dispatch(setSnackbarMessage('Tạo thông tin mới thành công'));
			onClose();
		} else {
			dispatch(setSnackbarMessage('Tạo thông tin mới không thành công'));
			onClose();
		}
	};

	const handleClose = () => {
		setCreatedRow([dummyDeviceDepartmentData]);
		onClose();
	};

	return (
		<Dialog fullScreen open={isOpen} onClose={handleClose}>
			<AppBar sx={{ position: 'relative', minWidth: '1200px', overflow: 'auto' }}>
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
						<CloseIcon />
					</IconButton>
					<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
						<b>Tạo thông tin thiết bị mới</b>
					</Typography>
					<Button autoFocus color="inherit" onClick={submit}>
						Lưu
					</Button>
				</Toolbar>
			</AppBar>
			<DialogContent sx={{ minWidth: '1200px', overflow: 'auto' }}>
				<form onSubmit={e => e.preventDefault()} style={{ marginTop: '10px' }}>
					{createdRow.map((field: any, indexField: number) => {
						return (
							<Stack
								sx={{
									width: '100%',
									gap: '1.5rem',
									display: 'flex',
									alignItems: 'center',
									flexDirection: 'row',
									marginBottom: '24px',
								}}
								key={indexField}
							>
								<RowCreateDevice
									field={field}
									handleFormChange={handleFormChange}
									indexField={indexField}
									removeFields={removeFields}
								/>
							</Stack>
						);
					})}
				</form>
				<Button variant="contained" onClick={() => addFields()}>
					Thêm hàng
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default DialogCreate;
