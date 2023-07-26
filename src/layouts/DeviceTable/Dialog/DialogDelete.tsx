import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { DialogProps } from './DialogType';

const DialogDelete = ({ isOpen, onClose, dataDelete, handleSubmitDelete }: DialogProps) => {
	return (
		<>
			<Dialog open={isOpen} onClose={onClose}>
				<DialogTitle textAlign="center">
					<b>Xoá thông tin thiết bị</b>
				</DialogTitle>
				<DialogContent>
					<div>
						Bạn có chắc muốn xoá thông tin phiếu xuất thiết bị{' '}
						<Typography component="span" color="red">
							{dataDelete?.DeviceId} - {dataDelete?.DeviceName}
						</Typography>{' '}
						không?
					</div>
				</DialogContent>
				<DialogActions sx={{ p: '1.25rem' }}>
					<Button onClick={onClose}>Hủy</Button>
					<Button
						color="primary"
						onClick={() => handleSubmitDelete?.(dataDelete?.DeviceId || '')}
						variant="contained"
					>
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default DialogDelete;
