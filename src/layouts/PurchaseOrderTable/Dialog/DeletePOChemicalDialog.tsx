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

const DeletePOChemicalDialog: FC<{
    isOpen: boolean;
    onClose: any;
    handleSubmit: any;
}> = ({ isOpen, onClose, handleSubmit }) => {
    const currentChemicalPO = useAppSelector((state: RootState) => state.purchaseOrder.currentChemicalPO);

    return (
        <Dialog open={isOpen}>
            <DialogTitle textAlign="center"><b>Xoá thông tin nhập hoá chất</b></DialogTitle>
            <DialogContent>
                <div>Bạn có chắc muốn xoá thông tin nhập hoá chất {`${currentChemicalPO.ChemDetailId}`} không?</div>
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

export default React.memo(DeletePOChemicalDialog);