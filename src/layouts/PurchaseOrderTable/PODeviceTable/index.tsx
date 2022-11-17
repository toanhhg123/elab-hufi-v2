import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { dummyDeviceData, IDeviceSpecType } from '../../../types/deviceType';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { IOrderDeviceType } from '../../../types/orderDeviceType';

const PurchaseOrderDeviceTable: FC<{ deviceData: IOrderDeviceType[] }> = ({ deviceData }) => {
  const deviceSpecData = useAppSelector((state: RootState) => state.device.listOfDeviceSpecs);
  const manufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);

  const [isDetailModal, setIsDetailModal] = useState(false);
  const [tableData, setTableData] = useState<IOrderDeviceType[]>([]);
  const [deviceSpecTableData, setDeviceSpecTableData] = useState<IDeviceSpecType[]>([]);

  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [selectedRow, setSelectedRow] = useState<any>(dummyDeviceData);

  useEffect(() => {
    let formatedDeviceData = deviceData.map((x: IOrderDeviceType) => {
      let manufacturerInfoIdx = manufacturersData.findIndex(y => y.ManufacturerId === x.ManufacturerId);
      return {
        ...x,
        "ManufacturerName": manufacturerInfoIdx > -1 ? manufacturersData[manufacturerInfoIdx].Name : ""
      }
    })
    setTableData(formatedDeviceData);
  }, [deviceData])

  useEffect(() => {
    if (selectedRow.DeviceId) {
      let formatedDeviceSpecData = deviceSpecData.filter(x => x.DeviceId === selectedRow.DeviceId);
      setDeviceSpecTableData(formatedDeviceSpecData);
    }

  }, [selectedRow, deviceSpecData])


  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IOrderDeviceType>,
    ): MRT_ColumnDef<IOrderDeviceType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IOrderDeviceType>[]>(
    () => [
      {
        accessorKey: 'DeviceDetailId',
        header: 'Id thiết bị',
        size: 100,
      },
      {
        accessorKey: 'DeviceName',
        header: 'Tên thiết bị',
        size: 100,
      },
      {
        accessorKey: 'Unit',
        header: 'Đơn vị',
        size: 100,
      },
      {
        accessorKey: 'QuantityOriginal',
        header: 'Số lượng',
        size: 100,
      },
      {
        accessorKey: 'Price',
        header: 'Giá',
        size: 100,
      },
      {
        accessorKey: 'Model',
        header: 'Mẫu',
        size: 100,
      },
      {
        accessorKey: 'Origin',
        header: 'Xuất xứ',
        size: 100,
      },

      {
        accessorKey: 'DeviceId',
        header: 'Id gốc',
        size: 100,
      },
      {
        accessorKey: 'ManufacturerName',
        header: 'Nhà sản xuất',
        size: 100,
      },
    ],
    [getCommonEditTextFieldProps],
  );

  const deviceSpecColumns = useMemo<MRT_ColumnDef<IDeviceSpecType>[]>(
    () => [
      {
        accessorKey: 'SpecsID',
        header: 'Id thông số',
        size: 100,
      },
      {
        accessorKey: 'SpecsName',
        header: 'Tên thông số',
        size: 100,
      },
      {
        accessorKey: 'SpecsValue',
        header: 'Giá trị',
        size: 100,
      },
    ],
    [getCommonEditTextFieldProps],
  );

  const handleOpenDetailModal = (row: any) => {
    setSelectedRow(row.original);
    setIsDetailModal(true);
  }

  const onCloseDetailModal = () => {
    setSelectedRow(dummyDeviceData);
    setIsDetailModal(false);
  }

  return (
    <>
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
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        enableRowNumbers
        enablePinning
        initialState={{
          density: 'compact',
          columnOrder: [
            'mrt-row-numbers',
            ...columns.map(x => x.accessorKey || ''),
          ]
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Tooltip arrow placement="left" title="Xem chi tiết thông số">
              <IconButton style={{ "paddingRight": "0px" }} onClick={() => handleOpenDetailModal(row)}>
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <h3 style={{ "margin": "0px" }}>
            <b><KeyboardArrowRightIcon
              style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
            ></KeyboardArrowRightIcon></b>
            <span>Thông tin thiết bị</span>
          </h3>
        )}
      />

      <Dialog open={isDetailModal}>
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
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={column.id && selectedRow[column.id]}
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
                data={deviceSpecTableData}
                editingMode="modal" //default
                enableColumnOrdering
                enableEditing
                enableRowNumbers
                enablePinning
                initialState={{
                  density: 'compact',
                  columnOrder: [
                    'mrt-row-numbers',
                    ...deviceSpecColumns.map(x => x.accessorKey || ''),
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
          <Button onClick={onCloseDetailModal}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PurchaseOrderDeviceTable;