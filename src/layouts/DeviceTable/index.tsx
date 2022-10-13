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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { dummyDeviceData, IDeviceType } from '../../types/deviceType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteDevice, getDevices, postDevice, updateDevice } from '../../services/deviceServices';
import { RootState } from '../../store';
import { setListOfDevices } from './deviceSlice';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const DeviceTable: FC = () => {
  const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
  const manufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IDeviceType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyDeviceData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyDeviceData);
  const [createdRow, setCreatedRow] = useState<any>(dummyDeviceData);

  useEffect(() => {
    let formatedDeviceData = deviceData.map((x: IDeviceType) => {
      let manufacturerInfoIdx = manufacturersData.findIndex(y => y.ManufacturerId === x.ManufacturerId);
      return {
        ...x,
        "ManufacturerName": manufacturerInfoIdx > -1 ? manufacturersData[manufacturerInfoIdx].Name : ""
      }
    })
    setTableData(formatedDeviceData);
  }, [deviceData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IDeviceType>,
    ): MRT_ColumnDef<IDeviceType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IDeviceType>[]>(
    () => [
      {
        accessorKey: 'DeviceId',
        header: 'Id thiết bị',
        size: 100,
      },
      {
        accessorKey: 'DeviceName',
        header: 'Tên thiết bị',
        size: 100,
      },
      {
        accessorKey: 'DeviceType',
        header: 'Loại thiết bị',
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
        accessorKey: 'Unit',
        header: 'Đơn vị',
        size: 100,
      },
      {
        accessorKey: 'Standard',
        header: 'Tiêu chuẩn',
        size: 100,
      },
      {
        accessorKey: 'Quantity',
        header: 'Số lượng',
        size: 100,
      },
      // {
      //   accessorKey: 'HasTrain',
      //   header: 'Đã tập huấn',
      //   size: 100,
      // },
      {
        accessorKey: 'ManufacturerName',
        header: 'Nhà sản xuất',
        size: 100,
      },
    ],
    [getCommonEditTextFieldProps],
  );

  const handleOpenEditModal = (row: any) => {
    setUpdatedRow(row.original);
    setIsEditModal(true);
  }

  const onCloseEditModal = () => {
    setUpdatedRow(dummyDeviceData);
    setIsEditModal(false);
  }

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updateDevice({
      "DeviceId": updatedRow.DeviceId,
      "DeviceName": updatedRow.DeviceName,
      "DeviceType": updatedRow.DeviceType,
      "Model": updatedRow.Model,
      "Origin": updatedRow.Origin,
      "Unit": updatedRow.Unit,
      "Standard": updatedRow.Standard,
      "Quantity": updatedRow.Quantity,
      "HasTrain": updatedRow.HasTrain,
      "ManufacturerId": updatedRow.ManufacturerId
    });
    if (isUpdatedSuccess) {
      let updatedIdx = deviceData.findIndex(x => x.DeviceId === updatedRow.DeviceId);
      let newListOfDevices = [...deviceData.slice(0, updatedIdx), updatedRow, ...deviceData.slice(updatedIdx + 1,)]
      dispatch(setListOfDevices(newListOfDevices));
    }

    onCloseEditModal();
  }

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    setDeletedRow(dummyDeviceData);
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deleteDevice(deletedRow.DeviceId);

    let deletedIdx = deviceData.findIndex(x => x.DeviceId === deletedRow.DeviceId);
    let newListOfDevices = [...deviceData.slice(0, deletedIdx), ...deviceData.slice(deletedIdx + 1,)]
    dispatch(setListOfDevices(newListOfDevices));

    onCloseDeleteModal();
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setCreatedRow(dummyDeviceData);
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdDevice = await postDevice({
      "DeviceId": createdRow.DeviceId,
      "DeviceName": createdRow.DeviceName,
      "DeviceType": createdRow.DeviceType,
      "Model": createdRow.Model,
      "Origin": createdRow.Origin,
      "Unit": createdRow.Unit,
      "Standard": createdRow.Standard,
      "Quantity": createdRow.Quantity,
      "HasTrain": createdRow.HasTrain,
      "ManufacturerId": createdRow.ManufacturerId
    })

    if (createdDevice) {
      const newListOfDevices: IDeviceType[] = await getDevices();
      if (newListOfDevices) {
        dispatch(setListOfDevices(newListOfDevices));
      }
    }

    onCloseCreateModal();
  }

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
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
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Sửa thông tin thiết bị">
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá thông tin thiết bị">
              <IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
                <Delete />
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
        renderBottomToolbarCustomActions={() => (
          <Tooltip title="Tạo thiết bị mới" placement="right-start">
            <Button
              color="primary"
              onClick={handleOpenCreateModal}
              variant="contained"
              style={{ "margin": "10px" }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Tooltip>
        )}
      />

      <Dialog open={isEditModal}>
        <DialogTitle textAlign="center"><b>Sửa thông tin thiết bị</b></DialogTitle>
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
                const manufacturerOptions: string[] = manufacturersData.map(x => x.Name.toString());
                if (column.id === "ManufacturerName" && manufacturersData.length > 0) {
                  return <FormControl sx={{ m: 0, minWidth: 120 }}>
                    <InputLabel id="manufacturer-select-required-label">Nhà sản xuất</InputLabel>
                    <Select
                      labelId="manufacturer-select-required-label"
                      id="manufacturer-select-required"
                      value={manufacturersData.findIndex(x => x.ManufacturerId === updatedRow.ManufacturerId) > -1 ?
                        manufacturersData.findIndex(x => x.ManufacturerId === updatedRow.ManufacturerId).toString() : ""}
                      label="Nhà sản xuất"
                      onChange={(e: SelectChangeEvent) =>
                        setUpdatedRow({
                          ...updatedRow,
                          "ManufacturerName": manufacturersData[Number(e.target.value)].Name,
                          "ManufacturerId": manufacturersData[Number(e.target.value)].ManufacturerId
                        })}
                    >
                      {manufacturerOptions.map((x, idx) => <MenuItem value={idx}>{x}</MenuItem>)}
                    </Select>
                  </FormControl>
                } else if (column.id === "DeviceId") {
                  return <TextField
                    disabled
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={column.id && updatedRow[column.id]}
                    onChange={(e) =>
                      setUpdatedRow({ ...updatedRow, [e.target.name]: e.target.value })
                    }
                  />
                }
                else {
                  return <TextField
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={column.id && updatedRow[column.id]}
                    onChange={(e) =>
                      setUpdatedRow({ ...updatedRow, [e.target.name]: e.target.value })
                    }
                  />
                }
              }
              )}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseEditModal}>Huỷ</Button>
          <Button color="primary" onClick={handleSubmitEditModal} variant="contained">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteModal}>
        <DialogTitle textAlign="center"><b>Xoá thông tin thiết bị</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin thiết bị {`${deletedRow.DeviceName}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Huỷ</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
        <DialogTitle textAlign="center"><b>Tạo thông tin thiết bị</b></DialogTitle>
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
                const manufacturerOptions: string[] = manufacturersData.map(x => x.Name.toString());

                if (column.id === "ManufacturerName" && manufacturersData.length > 0) {
                  return <FormControl sx={{ m: 0, minWidth: 120 }}>
                    <InputLabel id="manufacturer-select-required-label">Nhà sản xuất</InputLabel>
                    <Select
                      labelId="manufacturer-select-required-label"
                      id="manufacturer-select-required"
                      value={manufacturersData.findIndex(x => x.ManufacturerId === createdRow.ManufacturerId) > -1 ?
                        manufacturersData.findIndex(x => x.ManufacturerId === createdRow.ManufacturerId).toString() : ""}
                      label="Nhà sản xuất"
                      onChange={(e: SelectChangeEvent) =>
                        setCreatedRow({
                          ...createdRow,
                          "ManufacturerName": manufacturersData[Number(e.target.value)].Name,
                          "ManufacturerId": manufacturersData[Number(e.target.value)].ManufacturerId
                        })}
                    >
                      {manufacturerOptions.map((x, idx) => <MenuItem value={idx}>{x}</MenuItem>)}
                    </Select>
                  </FormControl>
                }
                else {
                  return <TextField
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={column.id && createdRow[column.id]}
                    onChange={(e) =>
                      setCreatedRow({ ...createdRow, [e.target.name]: e.target.value })
                    }
                  />
                }
              }
              )}

            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseCreateModal}>Huỷ</Button>
          <Button color="primary" onClick={handleSubmitCreateModal} variant="contained">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default DeviceTable;
