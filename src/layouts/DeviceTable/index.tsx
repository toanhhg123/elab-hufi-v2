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
import { dummyDeviceData, dummyDeviceSpecData, IDeviceSpecType, IDeviceType } from '../../types/deviceType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteDevice, deleteDeviceSpec, getDevices, getDeviceSpec, postDevice, postDeviceSpec, updateDevice, updateDeviceSpec } from '../../services/deviceServices';
import { RootState } from '../../store';
import { setListOfDevices, setListOfDeviceSpecs } from './deviceSlice';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { setSnackbarMessage } from '../../pages/appSlice';

const DeviceTable: FC = () => {
  const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
  const deviceSpecData = useAppSelector((state: RootState) => state.device.listOfDeviceSpecs);
  const manufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);
  const dispatch = useAppDispatch();

  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IDeviceType[]>([]);
  const [isDeviceSpecCreateModal, setIsDeviceSpecCreateModal] = useState(false);
  const [isDeviceSpecEditModal, setIsDeviceSpecEditModal] = useState<boolean>(false);
  const [isDeviceSpecDeleteModal, setIsDeviceSpecDeleteModal] = useState<boolean>(false);
  const [deviceSpecTableData, setDeviceSpecTableData] = useState<IDeviceSpecType[]>([]);

  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyDeviceData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyDeviceData);
  const [createdRow, setCreatedRow] = useState<any>(dummyDeviceData);
  const [selectedRow, setSelectedRow] = useState<any>(dummyDeviceData);
  const [deviceSpecUpdatedRow, setDeviceSpecUpdatedRow] = useState<any>(dummyDeviceSpecData);
  const [deviceSpecDeletedRow, setDeviceSpecDeletedRow] = useState<any>(dummyDeviceSpecData);
  const [deviceSpecCreatedRow, setDeviceSpecCreatedRow] = useState<any>(dummyDeviceSpecData);

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

  useEffect(() => {
    if (selectedRow.DeviceId) {
      let formatedDeviceSpecData = deviceSpecData.filter(x => x.DeviceId === selectedRow.DeviceId);
      setDeviceSpecTableData(formatedDeviceSpecData);
    }

  }, [selectedRow, deviceSpecData])


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
      dispatch(setSnackbarMessage("Cập nhật thông tin thiết bị thành công"));
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
    dispatch(setSnackbarMessage("Xóa thông tin thiết bị thành công"));
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
        dispatch(setSnackbarMessage("Tạo thông tin thiết bị mới thành công"));
        dispatch(setListOfDevices(newListOfDevices));
      }
    }

    onCloseCreateModal();
  }

  const handleOpenDetailModal = (row: any) => {
    setSelectedRow(row.original);
    setIsDetailModal(true);
  }

  const onCloseDetailModal = () => {
    setSelectedRow(dummyDeviceData);
    setIsDetailModal(false);
  }

  const handleOpenDeviceSpecEditModal = (row: any) => {
    setDeviceSpecUpdatedRow(row.original);
    setIsDeviceSpecEditModal(true);
  }

  const onCloseDeviceSpecEditModal = () => {
    setDeviceSpecUpdatedRow(dummyDeviceSpecData);
    setIsDeviceSpecEditModal(false);
  }

  const handleSubmitDeviceSpecEditModal = async () => {
    const isDeviceSpecUpdatedSuccess = await updateDeviceSpec({ ...deviceSpecUpdatedRow, "DeviceId": selectedRow.DeviceId });
    if (isDeviceSpecUpdatedSuccess) {
      dispatch(setSnackbarMessage("Cập nhật thông số thiết bị thành công"));
      let updatedDeviceSpecIdx = deviceSpecData.findIndex(x => (x.DeviceId === selectedRow.DeviceId && x.SpecsID === deviceSpecUpdatedRow.SpecsID));
      let newListOfDeviceSpecs = [...deviceSpecData.slice(0, updatedDeviceSpecIdx), deviceSpecUpdatedRow, ...deviceSpecData.slice(updatedDeviceSpecIdx + 1,)]
      dispatch(setListOfDeviceSpecs(newListOfDeviceSpecs));
    }

    onCloseDeviceSpecEditModal();
  }

  const handleOpenDeviceSpecDeleteModal = (row: any) => {
    setDeviceSpecDeletedRow(row.original);
    setIsDeviceSpecDeleteModal(true);
  }

  const onCloseDeviceSpecDeleteModal = () => {
    setDeviceSpecDeletedRow(dummyDeviceSpecData);
    setIsDeviceSpecDeleteModal(false);
  }

  const handleSubmitDeviceSpecDeleteModal = async () => {
    await deleteDeviceSpec(deviceSpecDeletedRow);
    dispatch(setSnackbarMessage("Xóa thông số thiết bị thành công"));
    let deletedIdx = deviceSpecData.findIndex(x => x.DeviceId === deviceSpecDeletedRow.DeviceId && x.SpecsID === deviceSpecDeletedRow.SpecsID);
    let newListOfDeviceSpecs = [...deviceSpecData.slice(0, deletedIdx), ...deviceSpecData.slice(deletedIdx + 1,)]
    dispatch(setListOfDeviceSpecs(newListOfDeviceSpecs));

    onCloseDeviceSpecDeleteModal();
  }

  const handleOpenDeviceSpecCreateModal = (row: any) => {
    setIsDeviceSpecCreateModal(true);
  }

  const onCloseDeviceSpecCreateModal = () => {
    setDeviceSpecCreatedRow(dummyDeviceSpecData);
    setIsDeviceSpecCreateModal(false);
  }

  const handleSubmitDeviceSpecCreateModal = async () => {
    const createdDeviceSpec = await postDeviceSpec({
      "DeviceId": selectedRow.DeviceId,
      "SpecsID": deviceSpecCreatedRow.SpecsID,
      "SpecsName": deviceSpecCreatedRow.SpecsName,
      "SpecsValue": deviceSpecCreatedRow.SpecsValue
    })
    if (createdDeviceSpec) {
      const newListOfDeviceSpec: IDeviceSpecType[] = await getDeviceSpec();
      if (newListOfDeviceSpec) {
        dispatch(setSnackbarMessage("Tạo thông số thiết bị mới thành công"));
        dispatch(setListOfDeviceSpecs(newListOfDeviceSpec));
      }
    }
    onCloseDeviceSpecCreateModal();
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
            'mrt-row-actions'
          ]
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Tooltip arrow placement="left" title="Xem chi tiết thông số">
              <IconButton style={{ "paddingRight": "0px" }} onClick={() => handleOpenDetailModal(row)}>
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Sửa thông tin thiết bị">
              <IconButton style={{ "paddingLeft": "0px", "paddingRight": "0px" }} onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá thông tin thiết bị">
              <IconButton style={{ "paddingLeft": "0px" }} color="error" onClick={() => handleOpenDeleteModal(row)}>
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
                    'mrt-row-actions'
                  ]
                }}
                renderRowActions={({ row, table }) => (
                  <Box sx={{ display: 'flex', gap: '1rem' }}>
                    <Tooltip arrow placement="left" title="Sửa thông số thiết bị">
                      <IconButton onClick={() => handleOpenDeviceSpecEditModal(row)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip arrow placement="right" title="Xoá thông số thiết bị">
                      <IconButton color="error" onClick={() => handleOpenDeviceSpecDeleteModal(row)}>
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
                    <span>Thông số thiết bị</span>
                  </h3>
                )}
                renderBottomToolbarCustomActions={() => (
                  <Tooltip title="Tạo thông số thiết bị mới" placement="right-start">
                    <Button
                      color="primary"
                      onClick={handleOpenDeviceSpecCreateModal}
                      variant="contained"
                      style={{ "margin": "10px" }}
                    >
                      <AddIcon fontSize="small" />
                    </Button>
                  </Tooltip>
                )}
              />

              <Dialog open={isDeviceSpecEditModal}>
                <DialogTitle textAlign="center"><b>Sửa thông số thiết bị</b></DialogTitle>
                <DialogContent>
                  <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
                    <Stack
                      sx={{
                        width: '100%',
                        minWidth: { xs: '300px', sm: '360px', md: '400px' },
                        gap: '1.5rem',
                      }}
                    >
                      {deviceSpecColumns.map((column) => (
                        (column.id !== "SpecsID") &&
                        <TextField
                          key={column.accessorKey}
                          label={column.header}
                          name={column.accessorKey}
                          defaultValue={column.id && deviceSpecUpdatedRow[column.id]}
                          onChange={(e) =>
                            setDeviceSpecUpdatedRow({ ...deviceSpecUpdatedRow, [e.target.name]: e.target.value })
                          }
                        />
                      ))}

                    </Stack>
                  </form>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                  <Button onClick={onCloseDeviceSpecEditModal}>Huỷ</Button>
                  <Button color="primary" onClick={handleSubmitDeviceSpecEditModal} variant="contained">
                    Lưu thay đổi
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={isDeviceSpecDeleteModal}>
                <DialogTitle textAlign="center"><b>Xoá thông số thiết bị</b></DialogTitle>
                <DialogContent>
                  <div>Bạn có chắc muốn xoá thông tin thông số {`${deviceSpecDeletedRow.SpecsID}`} của thiết bị {`${deviceSpecDeletedRow.DeviceId}`} không?</div>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                  <Button onClick={onCloseDeviceSpecDeleteModal}>Huỷ</Button>
                  <Button color="primary" onClick={handleSubmitDeviceSpecDeleteModal} variant="contained">
                    Xác nhận
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={isDeviceSpecCreateModal}>
                <DialogTitle textAlign="center"><b>Tạo thông tin thông số thiết bị</b></DialogTitle>
                <DialogContent>
                  <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
                    <Stack
                      sx={{
                        width: '100%',
                        minWidth: { xs: '300px', sm: '360px', md: '400px' },
                        gap: '1.5rem',
                      }}
                    >
                      {deviceSpecColumns.map((column) => {
                        return <TextField
                          key={column.accessorKey}
                          label={column.header}
                          name={column.accessorKey}
                          defaultValue={column.id && deviceSpecCreatedRow[column.id]}
                          onChange={(e) =>
                            setDeviceSpecCreatedRow({ ...deviceSpecCreatedRow, [e.target.name]: e.target.value })
                          }
                        />
                      })}

                    </Stack>
                  </form>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                  <Button onClick={onCloseDeviceSpecCreateModal}>Huỷ</Button>
                  <Button color="primary" onClick={handleSubmitDeviceSpecCreateModal} variant="contained">
                    Tạo
                  </Button>
                </DialogActions>
              </Dialog>

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

export default DeviceTable;
