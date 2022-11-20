import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

type DeleteExportModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string | String;
	handleSubmit: Function;
	children: React.ReactNode;
};

const DeleteExportModal = ({ isOpen, onClose, title, handleSubmit, children }: DeleteExportModalProps) => {
	return (
		<Dialog open={isOpen}>
			<DialogTitle textAlign="center">
				<b>{title}</b>
			</DialogTitle>
			<DialogContent>
				<div>{children}</div>
			</DialogContent>
			<DialogActions sx={{ p: '1.25rem' }}>
				<Button onClick={onClose}>Huỷ</Button>
				<Button
					color="primary"
					onClick={() => {
						handleSubmit();
						onClose();
					}}
					variant="contained"
				>
					Xác nhận
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteExportModal