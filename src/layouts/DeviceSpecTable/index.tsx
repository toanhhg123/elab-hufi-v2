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
import { Delete, Edit } from '@mui/icons-material';
import { dummyDeviceSpecData, IDeviceSpecType } from '../../types/deviceSpecType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteDeviceSpec, getDeviceSpec, postDeviceSpec, updateDeviceSpec } from '../../services/deviceSpecServices';
import { RootState } from '../../store';
import { setListOfDeviceSpecs } from './deviceSpecSlice';

const DeviceSpecTable: FC = () => {
  const deviceSpecData = useAppSelector((state: RootState) => state.deviceSpecs.listOfDeviceSpecs);
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IDeviceSpecType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyDeviceSpecData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyDeviceSpecData);
  const [createdRow, setCreatedRow] = useState<any>(dummyDeviceSpecData);

  const getTableData = async () => {
    const listOfDeviceSpec: IDeviceSpecType[] = await getDeviceSpec();
    if (listOfDeviceSpec) {
      dispatch(setListOfDeviceSpecs(listOfDeviceSpec));
    }
  }

  useEffect(() => {
    getTableData();
  }, [])

  useEffect(() => {
    setTableData(deviceSpecData);
  }, [deviceSpecData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IDeviceSpecType>,
    ): MRT_ColumnDef<IDeviceSpecType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        // onBlur: (event) => {
        //   const isValid =
        //     cell.column.id === 'email'
        //       ? validateEmail(event.target.value)
        //       : cell.column.id === 'age'
        //       ? validateAge(+event.target.value)
        //       : validateRequired(event.target.value);
        //   if (!isValid) {
        //     //set validation error for cell if invalid
        //     setValidationErrors({
        //       ...validationErrors,
        //       [cell.id]: `${cell.column.columnDef.header} is required`,
        //     });
        //   } else {
        //     //remove validation error for cell if valid
        //     delete validationErrors[cell.id];
        //     setValidationErrors({
        //       ...validationErrors,
        //     });
        //   }
        // },
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IDeviceSpecType>[]>(
    () => [
      {
        accessorKey: 'DeviceId',
        header: 'Id thiết bị',
        enableColumnOrdering: true,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 50,
      },
      {
        accessorKey: 'SpecsID',
        header: 'Id thông số',
        size: 100,
      },
      {
        accessorKey: 'SpecsName',
        header: 'Tên',
        size: 140,
      },
      {
        accessorKey: 'SpecsValue',
        header: 'Giá trị',
        size: 140,
      },
    ],
    [getCommonEditTextFieldProps],
  );

  const handleOpenEditModal = (row: any) => {
    setUpdatedRow(row.original);
    setIsEditModal(true);
  }

  const onCloseEditModal = () => {
    setIsEditModal(false);
  }

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updateDeviceSpec(updatedRow);
    if (isUpdatedSuccess) {
      let updatedIdx = deviceSpecData.findIndex(x =>(x.DeviceId === updatedRow.DeviceId && x.SpecsID === updatedRow.SpecsID));
      let newListOfDeviceSpecs = [...deviceSpecData.slice(0, updatedIdx), updatedRow, ...deviceSpecData.slice(updatedIdx + 1,)]
      dispatch(setListOfDeviceSpecs(newListOfDeviceSpecs));
    }

    setIsEditModal(false);
    setUpdatedRow(dummyDeviceSpecData);
  }

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deleteDeviceSpec(deletedRow);

    let deletedIdx = deviceSpecData.findIndex(x => x.DeviceId === deletedRow.DeviceId && x.SpecsID === deletedRow.SpecsID);
    let newListOfDeviceSpecs = [...deviceSpecData.slice(0, deletedIdx), ...deviceSpecData.slice(deletedIdx + 1,)]
    dispatch(setListOfDeviceSpecs(newListOfDeviceSpecs));

    setIsDeleteModal(false);
    setDeletedRow(dummyDeviceSpecData);
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdDeviceSpec = await postDeviceSpec({
      "DeviceId": createdRow.DeviceId,
      "SpecsID": createdRow.SpecsID,
      "SpecsName": createdRow.SpecsName,
      "SpecsValue": createdRow.SpecsValue
    })
    if(createdDeviceSpec){
      const newListOfDeviceSpec: IDeviceSpecType[] = await getDeviceSpec();
      if(newListOfDeviceSpec){
        dispatch(setListOfDeviceSpecs(newListOfDeviceSpec));
      }
    }
    setIsCreateModal(false);
    setCreatedRow(dummyDeviceSpecData);
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
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Sửa thông số thiết bị">
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá thông số thiết bị">
              <IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderBottomToolbarCustomActions={() => (
          <Button
            color="primary"
            onClick={handleOpenCreateModal}
            variant="contained"
            style={{ "margin": "10px" }}
          >
            Tạo thông số thiết bị mới
          </Button>
        )}
      />

      <Dialog open={isEditModal}>
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
              {columns.map((column) => (
                (column.id === "DeviceId" || column.id === "SpecsID") ?
                  <TextField
                    disabled
                    key={column.accessorKey}
                    label={column.accessorKey}
                    name={column.accessorKey}
                    defaultValue={column.id && updatedRow[column.id]}
                  /> :
                  <TextField
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={column.id && updatedRow[column.id]}
                    onChange={(e) =>
                      setUpdatedRow({ ...updatedRow, [e.target.name]: e.target.value })
                    }
                  />
              ))}

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
        <DialogTitle textAlign="center"><b>Xoá thông số thiết bị</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin thông số {`${deletedRow.SpecsID}`} thiết bị {`${deletedRow.DeviceId}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Huỷ</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
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
              {columns.map((column) => (
                  <TextField
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={column.id && updatedRow[column.id]}
                    onChange={(e) =>
                      setCreatedRow({ ...createdRow, [e.target.name]: e.target.value })
                    }
                  />
              ))}

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

export default DeviceSpecTable;
