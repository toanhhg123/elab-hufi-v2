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

const DeleteMemberTeamModal: FC<{
    isOpen: boolean;
    onClose: any;
    handleSubmit: any;
}> = ({ isOpen, onClose, handleSubmit }) => {
    const { currentMemberTeam } = useAppSelector((state: RootState) => state.researchTeam);

    return (
        <Dialog open={isOpen}>
            <DialogTitle textAlign="center"><b>Xoá thông tin thành viên</b></DialogTitle>
            <DialogContent>
                <div>Bạn có chắc muốn xoá thông tin thành viên {`${currentMemberTeam.ResearcherId}`} không?</div>
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

export default React.memo(DeleteMemberTeamModal);