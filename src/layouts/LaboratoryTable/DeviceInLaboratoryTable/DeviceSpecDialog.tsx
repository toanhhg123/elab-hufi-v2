import React, { FC } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { IDeviceSpecType, IDeviceType } from '../../../types/deviceType';
import { Stack } from '@mui/system';
import MaterialReactTable from 'material-react-table';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ColumnType } from '../Utils';

const DeviceSpecDialog: FC<{
    isOpen: boolean,
    deviceSpecColumns: any,
    onClose: () => void,
    selectedDeivce: IDeviceType,
    columns: ColumnType[],
    deviceSpecData: IDeviceSpecType[]
}> = ({ isOpen, deviceSpecColumns, onClose, selectedDeivce, columns, deviceSpecData }) => {
    return (
        <Dialog open={isOpen}>
            <DialogTitle textAlign="center"><b>Thông tin chi tiết thiết bị</b></DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >
                        {columns.map((column) => {
                            if (column.id === "DeviceId" || column.id === "DeviceName") {
                                return <TextField
                                    disabled
                                    key={column.id}
                                    label={column.header}
                                    name={column.header}
                                    defaultValue={column.id && selectedDeivce[column.id]}
                                />
                            }
                        }
                        )}

                        <MaterialReactTable
                            displayColumnDefOptions={{
                                'mrt-row-actions': {
                                    header: 'Các hành động',
                                    muiTableHeadCellProps: {
                                        align: 'center',
                                    },
                                    muiTableBodyCellProps: {
                                        align: 'center',
                                    },
                                },
                                'mrt-row-numbers': {
                                    muiTableHeadCellProps: {
                                        align: 'center',
                                    },
                                    muiTableBodyCellProps: {
                                        align: 'center',
                                    },
                                }
                            }}
                            columns={deviceSpecColumns}
                            data={deviceSpecData}
                            editingMode="modal" //default
                            enableColumnOrdering
                            enableEditing
                            enableRowNumbers
                            enablePinning
                            initialState={{
                                density: 'compact',
                                columnOrder: [
                                    'mrt-row-numbers',
                                    ...deviceSpecColumns.map((x: any) => x.accessorKey || ''),
                                ]
                            }}
                            renderTopToolbarCustomActions={() => (
                                <h3 style={{ "margin": "0px" }}>
                                    <b><KeyboardArrowRightIcon
                                        style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
                                    ></KeyboardArrowRightIcon></b>
                                    <span>Thông số thiết bị</span>
                                </h3>
                            )}
                        />
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>Đóng</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DeviceSpecDialog);