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
import { dummySubjectData, ISubjectType } from '../../types/subjectType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteSubject, getSubjects, postSubject, updateSubject } from '../../services/subjectServices';
import { RootState } from '../../store';
import { setListOfSubjects } from './subjectSlice';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { setSnackbarMessage } from '../../pages/appSlice';

const SubjectTable: FC = () => {
  const subjectData = useAppSelector((state: RootState) => state.subject.listOfSubjects);
  const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ISubjectType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummySubjectData);
  const [deletedRow, setDeletedRow] = useState<any>(dummySubjectData);
  const [createdRow, setCreatedRow] = useState<any>(dummySubjectData);

  useEffect(() => {
    let formatedSubjectData = subjectData.map((sub: ISubjectType) => {
      let departmentInfoIdx = departmentData.findIndex(y => y.DepartmentId === sub.DepartmentId);
      return {
        ...sub,
        "DepartmentName": departmentInfoIdx > -1 ? departmentData[departmentInfoIdx].DepartmentName : ""
      }
    })

    setTableData(formatedSubjectData);
  }, [subjectData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<ISubjectType>,
    ): MRT_ColumnDef<ISubjectType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<ISubjectType>[]>(
    () => [
      {
        accessorKey: 'SubjectId',
        header: 'Id môn học',
        size: 100,
      },
      {
        accessorKey: 'SubjectName',
        header: 'Tên môn học',
        size: 100,
      },
      {
        accessorKey: 'Credits',
        header: 'Số tín chỉ',
        size: 140,
      },
      {
        accessorKey: 'DepartmentName',
        header: 'Phòng ban/Khoa',
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
    setUpdatedRow(dummySubjectData);
    setIsEditModal(false);
  }

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updateSubject({
      "SubjectId": updatedRow.SubjectId,
      "SubjectName": updatedRow.SubjectName,
      "Credits": updatedRow.Credits,
      "DepartmentId": updatedRow.DepartmentId
    });
    if (isUpdatedSuccess) {
      dispatch(setSnackbarMessage("Cập nhật thông tin môn học thành công"));
      let updatedIdx = subjectData.findIndex(x => x.SubjectId === updatedRow.SubjectId);
      let newListOfSubjects = [...subjectData.slice(0, updatedIdx), updatedRow, ...subjectData.slice(updatedIdx + 1,)]
      dispatch(setListOfSubjects(newListOfSubjects));
    }

    onCloseEditModal();
  }

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deleteSubject(deletedRow.SubjectId);
    dispatch(setSnackbarMessage("Xóa thông tin môn học thành công"));
    let deletedIdx = subjectData.findIndex((x: ISubjectType) => x.SubjectId === deletedRow.SubjectId);
    let newListOfSubjects = [...subjectData.slice(0, deletedIdx), ...subjectData.slice(deletedIdx + 1,)]
    dispatch(setListOfSubjects(newListOfSubjects));

    setIsDeleteModal(false);
    setDeletedRow(dummySubjectData);
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setCreatedRow(dummySubjectData);
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdSubject = await postSubject({
      "SubjectId": createdRow.SubjectId,
      "SubjectName": createdRow.SubjectName,
      "Credits": createdRow.Credits,
      "DepartmentId": createdRow.DepartmentId
    })

    if (createdSubject) {
      const newListOfSubjects: ISubjectType[] = await getSubjects();
      if (newListOfSubjects) {
        dispatch(setSnackbarMessage("Tạo thông tin môn học mới thành công"));
        dispatch(setListOfSubjects(newListOfSubjects));
      }
    }
    onCloseCreateModal();
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
          <>
            <Tooltip arrow placement="left" title="Sửa thông tin môn học">
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá thông tin môn học">
              <IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        )}
        renderTopToolbarCustomActions={() => (
          <h3 style={{ "margin": "0px" }}>
            <b><KeyboardArrowRightIcon
              style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
            ></KeyboardArrowRightIcon></b>
            <span>Thông tin môn học</span>
          </h3>
        )}
        renderBottomToolbarCustomActions={() => (
          <Tooltip title="Tạo môn học mới" placement="right-start">
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
        <DialogTitle textAlign="center"><b>Sửa thông tin môn học</b></DialogTitle>
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
                if (column.id === "DepartmentName" && departmentData.length > 0) {
                  const departmentOptions: string[] = departmentData.map(x => x.DepartmentName.toString());

                  return <FormControl sx={{ m: 0, minWidth: 120 }}>
                    <InputLabel id="department-select-required-label">Phòng ban</InputLabel>
                    <Select
                      labelId="department-select-required-label"
                      id="department-select-required"
                      value={departmentData.findIndex(x => x.DepartmentId === updatedRow.DepartmentId) > -1 ?
                        departmentData.findIndex(x => x.DepartmentId === updatedRow.DepartmentId).toString() : ""}
                      label="Phòng ban"
                      onChange={(e: SelectChangeEvent) =>
                        setUpdatedRow({
                          ...updatedRow,
                          "DepartmentName": departmentData[Number(e.target.value)].DepartmentName,
                          "DepartmentId": departmentData[Number(e.target.value)].DepartmentId
                        })}
                    >
                      {departmentOptions.map((x, idx) => <MenuItem value={idx}>{x}</MenuItem>)}
                    </Select>
                  </FormControl>
                } else {
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
              })}

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
        <DialogTitle textAlign="center"><b>Xoá thông tin môn học</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin môn học {`${deletedRow.SubjectName}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Huỷ</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
        <DialogTitle textAlign="center"><b>Tạo thông tin môn học</b></DialogTitle>
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
                if (column.id === "DepartmentName" && departmentData.length > 0) {
                  const departmentOptions: string[] = departmentData.map(x => x.DepartmentName.toString());

                  return <FormControl sx={{ m: 0, minWidth: 120 }}>
                    <InputLabel id="department-select-required-label">Phòng ban</InputLabel>
                    <Select
                      labelId="department-select-required-label"
                      id="department-select-required"
                      value={departmentData.findIndex(x => x.DepartmentId === createdRow.DepartmentId) > -1 ?
                        departmentData.findIndex(x => x.DepartmentId === createdRow.DepartmentId).toString() : ""}
                      label="Phòng ban"
                      onChange={(e: SelectChangeEvent) =>
                        setCreatedRow({
                          ...createdRow,
                          "DepartmentName": departmentData[Number(e.target.value)].DepartmentName,
                          "DepartmentId": departmentData[Number(e.target.value)].DepartmentId
                        })}
                    >
                      {departmentOptions.map((x, idx) => <MenuItem value={idx}>{x}</MenuItem>)}
                    </Select>
                  </FormControl>
                } else {
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
              })}
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

export default SubjectTable;
