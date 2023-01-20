import React, { FC, useEffect, useState } from 'react';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextareaAutosize,
    TextField,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setCurrentSuggestNewDevice } from '../suggestNewDeviceSlice';
import { RootState } from '../../../store';
import { ColumnType } from '../Utils';

const CreateDetailNewDevicesDialog: FC<{
    isOpen: boolean;
    onClose: any;
    handleSubmit: any;
    columns: ColumnType[];
}> = ({ isOpen, columns, onClose, handleSubmit }) => {
    const currentSuggestNewDevice = useAppSelector((state: RootState) => state.suggestNewDevice.currentSuggestNewDevice);

    const dispatch = useAppDispatch();

    return <Dialog open={isOpen}>
        <DialogTitle textAlign="center"><b>Thêm thông tin thiết bị đề xuất</b></DialogTitle>
        <DialogContent>
            <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
                <Stack
                    sx={{
                        width: '100%',
                        minWidth: { xs: '300px', sm: '360px', md: '400px' },
                        gap: '1.5rem',
                    }}
                >
                    {columns.map(column => {
                        if (column.id === 'Note') {
                            return <TextareaAutosize
                                aria-label="minimum height"
                                key={"CreateNote"}
                                minRows={3}
                                placeholder="Nhập ghi chú..."
                                defaultValue={currentSuggestNewDevice["Note"]}
                                onChange={(e) =>
                                    dispatch(setCurrentSuggestNewDevice({
                                        ...currentSuggestNewDevice,
                                        "Note": e.target.value
                                    }))
                                }
                            />
                        }
                        else {
                            return <TextField
                                key={"Create" + column.id}
                                label={column.header}
                                name={column.id}
                                defaultValue={column.id && currentSuggestNewDevice[column.id as keyof typeof currentSuggestNewDevice]}
                                onChange={(e) =>
                                    dispatch(setCurrentSuggestNewDevice({
                                        ...currentSuggestNewDevice,
                                        [e.target.name]: e.target.value
                                    }))
                                }
                            />
                        }
                    })}
                </Stack>
            </form>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
            <Button onClick={onClose}>Hủy</Button>
            <Button color="primary" onClick={handleSubmit} variant="contained">
                Tạo
            </Button>
        </DialogActions>
    </Dialog>
}

export default React.memo(CreateDetailNewDevicesDialog);