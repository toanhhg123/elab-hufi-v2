import React, { FC, useEffect, useState } from 'react';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setCurrentDevicePO } from '../purchaseOrderSlice';
import { RootState } from '../../../store';
import { ColumnType } from '../Utils';
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

const CreatePODeviceDialog: FC<{
    isOpen: boolean;
    onClose: any;
    handleSubmit: any;
    columns: ColumnType[];
}> = ({ isOpen, columns, onClose, handleSubmit }) => {
    const currentDevicePO = useAppSelector((state: RootState) => state.purchaseOrder.currentDevicePO);
    const manufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);

    const [manufacturersDataValue, setManufacturersDataValue] = useState<any>([]);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (manufacturersData.length > 0) {
            const list = manufacturersData.map(x => ({
                label: `${x.ManufacturerId} - ${x.Name}`,
                id: x.ManufacturerId,
                name: x.Name
            }));
            setManufacturersDataValue(list);
        }
    }, [manufacturersData])

    return <Dialog open={isOpen}>
        <DialogTitle textAlign="center"><b>Thêm thông tin nhập thiết bị</b></DialogTitle>
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
                        if (column.type === 'date') {
                            return (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        key={"Create" + column.id}
                                        label={column.header}
                                        value={new Date(Number(currentDevicePO[column.id as keyof typeof currentDevicePO]) * 1000)}
                                        onChange={(val: any) => {
                                            dispatch(setCurrentDevicePO({
                                                ...currentDevicePO,
                                                [`formated${column.id}`]: moment.unix(Date.parse(val) / 1000).format('DD/MM/YYYY'),
                                                [`${column?.id}`]: Date.parse(val) / 1000
                                            }))
                                        }
                                        }
                                        renderInput={(params: any) => <TextField key={"CreateTextField" + column.id} {...params} />}
                                        inputFormat='DD/MM/YYYY'
                                    />
                                </LocalizationProvider>
                            );
                        }
                        else if (column.id === "ManufacturerName") {
                            return <Autocomplete
                                key={"ManufacturerName"}
                                options={manufacturersDataValue}
                                noOptionsText="Không có kết quả trùng khớp"
                                sx={{ "width": "450px" }}
                                value={manufacturersDataValue.find((x: any) => x.id === currentDevicePO.ManufacturerId) || null}
                                getOptionLabel={option => option?.label}
                                renderInput={params => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={column.header}
                                            placeholder="Nhập để tìm kiếm"
                                        />
                                    );
                                }}
                                onChange={(event, value) => {
                                    dispatch(setCurrentDevicePO({
                                        ...currentDevicePO,
                                        "ManufacturerId": value?.id,
                                        "ManufacturerName": value?.name,
                                    }));
                                }}
                            />
                        }
                        else {
                            return <TextField
                                key={column.id}
                                label={column.header}
                                name={column.id}
                                defaultValue={column.id && currentDevicePO[column.id as keyof typeof currentDevicePO]}
                                onChange={(e) =>
                                    dispatch(setCurrentDevicePO({ ...currentDevicePO, [e.target.name]: e.target.value }))
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

export default React.memo(CreatePODeviceDialog);