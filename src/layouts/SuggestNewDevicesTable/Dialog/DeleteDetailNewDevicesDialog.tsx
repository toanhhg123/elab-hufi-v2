import React, { FC } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';

const DeleteDetailNewDevicesDialog: FC<{
    isOpen: boolean;
    onClose: any;
    handleSubmit: any;
}> = ({ isOpen, onClose, handleSubmit }) => {
    const currentSuggestNewDevice = useAppSelector((state: RootState) => state.suggestNewDevice.currentSuggestNewDevice);

    return (
        <Dialog open={isOpen}>
            <DialogTitle textAlign="center"><b>Xoá thông tin đề xuất thiết bị</b></DialogTitle>
            <DialogContent>
                <div>Bạn có chắc muốn xoá thông tin đề xuất thiết bị {`${currentSuggestNewDevice.SuggestDetailId}`} không?</div>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>Hủy</Button>
                <Button color="primary" onClick={handleSubmit} variant="contained">
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default React.memo(DeleteDetailNewDevicesDialog);