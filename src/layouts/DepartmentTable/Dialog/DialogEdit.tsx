import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
} from '@mui/material';

import { useState } from 'react';
import { columns, DialogProps } from './DialogType';

const DialogEdit = ({ isOpen, onClose, dataUpdate, handleSubmitUpdate }: DialogProps) => {
	const [updatedRow, setUpdatedRow] = useState<any>(() => dataUpdate);

	return (
		<Dialog open={isOpen} onClose={onClose} PaperProps={{ style: { width: '800px', maxWidth: 'unset' } }}>
			<DialogTitle textAlign="center">
				<b>Sửa thông tin thiết bị</b>
			</DialogTitle>
			<DialogContent>
				<form onSubmit={e => e.preventDefault()} style={{ marginTop: '10px' }}>
					<Stack
						sx={{
							width: '100%',
							minWidth: { xs: '300px', sm: '360px', md: '400px' },
							gap: '1.5rem',
						}}
					>
						{updatedRow &&
							columns.map(column => {
								if (column.id === 'DeviceId') {
									return (
										<TextField
											disabled
											key={column.id}
											label={column.header}
											name={column.id}
											value={column.id && updatedRow[column.id]}
										/>
									);
								}
								if (column?.type === 'select' && column.id === 'HasTrain') {
									const list = column.data;

									return (
										<FormControl key={column.id}>
											<InputLabel>{column.header}</InputLabel>
											<Select
												value={
													list?.findIndex(
														(x: any) => x === column?.renderValue?.(updatedRow[column.id]),
													) > -1
														? list
																?.findIndex(
																	(x: any) =>
																		x ===
																		column?.renderValue?.(updatedRow[column.id]),
																)
																.toString()
														: ''
												}
												name={column.id}
												label={column.header}
												onChange={(e: SelectChangeEvent) =>
													setUpdatedRow({
														...updatedRow,
														[column.id]: list[Number(e.target.value)],
													})
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
								}
								if (column?.type === 'select') {
									const list = column.data;

									return (
										<FormControl key={column.id}>
											<InputLabel>{column.header}</InputLabel>
											<Select
												value={
													list?.findIndex((x: any) => x === updatedRow[column.id]) > -1
														? list
																?.findIndex((x: any) => x === updatedRow[column.id])
																.toString()
														: ''
												}
												name={column.id}
												label={column.header}
												onChange={(e: SelectChangeEvent) =>
													setUpdatedRow({
														...updatedRow,
														[column.id]: list[Number(e.target.value)],
													})
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
									return (
										<TextField
											key={column.id}
											label={column.header}
											name={column.id}
											value={column.id && updatedRow[column.id]}
											onChange={e =>
												setUpdatedRow({ ...updatedRow, [column.id]: e.target.value })
											}
										/>
									);
								}
							})}
					</Stack>
				</form>
			</DialogContent>
			<DialogActions sx={{ p: '1.25rem' }}>
				<Button onClick={onClose}>Hủy</Button>
				<Button color="primary" onClick={() => handleSubmitUpdate?.(updatedRow)} variant="contained">
					Lưu thay đổi
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DialogEdit;
