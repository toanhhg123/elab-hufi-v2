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

const DeleteResearchTeamModal: FC<{
    isOpen: boolean;
    onClose: any;
    handleSubmit: any;
}> = ({ isOpen, onClose, handleSubmit }) => {
    const { currentResearchTeam } = useAppSelector((state: RootState) => state.researchTeam);

    return (
        <Dialog open={isOpen}>
            <DialogTitle textAlign="center"><b>Xoá thông tin nhóm nghiên cứu</b></DialogTitle>
            <DialogContent>
                <div>Bạn có chắc muốn xoá thông tin nhóm nghiên cứu {`${currentResearchTeam.TeamName}`} không?</div>
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

export default React.memo(DeleteResearchTeamModal);