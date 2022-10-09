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
import { dummyLaboratoryData, ILaboratoryType } from '../../types/laboratoriesType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteLaboratories, getLaboratories, postLaboratories, updateLaboratories } from '../../services/laboratoriesServices';
import { RootState } from '../../store';
import { setListOfLaboratories } from './laboratoriesSlice';

const LaboratoriesTable: FC = () => {
  const laboratoriesData = useAppSelector((state: RootState) => state.laboratories.listOfLaboratories);
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ILaboratoryType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyLaboratoryData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyLaboratoryData);
  const [createdRow, setCreatedRow] = useState<any>(dummyLaboratoryData);

  const getTableData = async () => {
    const listOfLaboratories: ILaboratoryType[] = await getLaboratories();
    if (listOfLaboratories) {
      dispatch(setListOfLaboratories(listOfLaboratories));
    }
  }

  useEffect(() => {
    getTableData();
  }, [])

  useEffect(() => {
    setTableData(laboratoriesData);
  }, [laboratoriesData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<ILaboratoryType>,
    ): MRT_ColumnDef<ILaboratoryType>['muiTableBodyCellEditTextFieldProps'] => {
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

  const columns = useMemo<MRT_ColumnDef<ILaboratoryType>[]>(
    () => [
      {
        accessorKey: 'LabId',
        header: 'LabId',
        enableColumnOrdering: true,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 50,
      },
      {
        accessorKey: 'LabName',
        header: 'Tên phòng lab',
        size: 100,
      },
      {
        accessorKey: 'Location',
        header: 'Địa điểm',
        size: 140,
      },
      {
        accessorKey: 'Note',
        header: 'Ghi chú',
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
    const isUpdatedSuccess = await updateLaboratories(updatedRow.LabId, updatedRow);
    if (isUpdatedSuccess) {
      let updatedIdx = laboratoriesData.findIndex(x => x.LabId === updatedRow.LabId);
      let newListOfLabs = [...laboratoriesData.slice(0, updatedIdx), updatedRow, ...laboratoriesData.slice(updatedIdx + 1,)]
      dispatch(setListOfLaboratories(newListOfLabs));
    }

    setIsEditModal(false);
    setUpdatedRow(dummyLaboratoryData);
  }

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deleteLaboratories(deletedRow.LabId);

    let deletedIdx = laboratoriesData.findIndex(x => x.LabId === deletedRow.LabId);
    let newListOfLabs = [...laboratoriesData.slice(0, deletedIdx), ...laboratoriesData.slice(deletedIdx + 1,)]
    dispatch(setListOfLaboratories(newListOfLabs));

    setIsDeleteModal(false);
    setDeletedRow(dummyLaboratoryData);
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdLab = await postLaboratories({
      "LabName": createdRow.LabName,
      "Location": createdRow.Location,
      "Note": createdRow.Note
    })
    if(createdLab){
      const newListOfLaboratories: ILaboratoryType[] = await getLaboratories();
      if(newListOfLaboratories){
        dispatch(setListOfLaboratories(newListOfLaboratories));
      }
    }
    setIsCreateModal(false);
    setCreatedRow(dummyLaboratoryData);
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
            <Tooltip arrow placement="left" title="Sửa thông tin Lab">
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá Lab">
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
            Tạo Lab mới
          </Button>
        )}
      />

      <Dialog open={isEditModal}>
        <DialogTitle textAlign="center"><b>Sửa thông tin Lab</b></DialogTitle>
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
                column.id === "LabId" ?
                  <TextField
                    disabled
                    key="LabId"
                    label="LabId"
                    name="LabId"
                    defaultValue={updatedRow["LabId"]}
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
        <DialogTitle textAlign="center"><b>Xoá thông tin Lab</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin Lab {`${deletedRow.LabId}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Huỷ</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
        <DialogTitle textAlign="center"><b>Tạo thông tin Lab</b></DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              {columns.slice(1, ).map((column) => (
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

export default LaboratoriesTable;
