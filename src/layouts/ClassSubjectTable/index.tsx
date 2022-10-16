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
import { dummyClassSubjectData, IClassSubjectType } from '../../types/classSubjectType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteClassSubject, getClassSubjects, postClassSubject, updateClassSubject } from '../../services/clasSubjectServices';
import { RootState } from '../../store';
import { setListOfClassSubjects } from './classSubjectSlice';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { setSnackbarMessage } from '../../pages/appSlice';

const ClassSubjectTable: FC = () => {
  const classSubjectData = useAppSelector((state: RootState) => state.classSubject.listOfClassSubjects);
  const subjectData = useAppSelector((state: RootState) => state.subject.listOfSubjects);
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IClassSubjectType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyClassSubjectData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyClassSubjectData);
  const [createdRow, setCreatedRow] = useState<any>(dummyClassSubjectData);

  useEffect(() => {
    let formatedClassSubjectData = classSubjectData.map((x: IClassSubjectType) => {
      let subjectInfoIdx = subjectData.findIndex(y => y.SubjectId === x.SubjectId);
      return {
        ...x,
        "SubjectName": subjectInfoIdx > -1 ? subjectData[subjectInfoIdx].SubjectName : ""
      }
    })

    setTableData(formatedClassSubjectData);
  }, [classSubjectData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IClassSubjectType>,
    ): MRT_ColumnDef<IClassSubjectType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IClassSubjectType>[]>(
    () => [
      {
        accessorKey: 'ClassId',
        header: 'Id lớp',
        size: 140,
      },
      {
        accessorKey: 'ClassName',
        header: 'Tên lớp',
        size: 140,
      },
      {
        accessorKey: 'NumOfStudent',
        header: 'Số lượng sinh viên',
        size: 140,
      },
      {
        accessorKey: 'TeacherName',
        header: 'Tên giảng viên',
        size: 140,
      },
      {
        accessorKey: 'Semester',
        header: 'Học kỳ',
        size: 50,
      },
      {
        accessorKey: 'Schoolyear',
        header: 'Năm học',
        size: 50,
      },
      {
        accessorKey: 'SubjectName',
        header: 'Tên môn học',
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
    setUpdatedRow(dummyClassSubjectData);
    setIsEditModal(false);
  }

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updateClassSubject({
      "ClassId": updatedRow.ClassId,
      "ClassName": updatedRow.ClassName,
      "NumOfStudent": updatedRow.NumOfStudent,
      "TeacherName": updatedRow.TeacherName,
      "Semester": updatedRow.Semester,
      "Schoolyear": updatedRow.Schoolyear,
      "SubjectId": updatedRow.SubjectId
    });
    if (isUpdatedSuccess) {
      dispatch(setSnackbarMessage("Cập nhật thông tin lớp học phần thành công"));
      let updatedIdx = classSubjectData.findIndex(x => x.ClassId === updatedRow.ClassId);
      let newListOfClassSubjects = [...classSubjectData.slice(0, updatedIdx), updatedRow, ...classSubjectData.slice(updatedIdx + 1,)]
      dispatch(setListOfClassSubjects(newListOfClassSubjects));
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
    await deleteClassSubject(deletedRow.ClassId);
    dispatch(setSnackbarMessage("Xóa thông tin lớp học phần thành công"));
    let deletedIdx = classSubjectData.findIndex(x => x.ClassId === deletedRow.ClassId);
    let newListOfClassSubjects = [...classSubjectData.slice(0, deletedIdx), ...classSubjectData.slice(deletedIdx + 1,)]
    dispatch(setListOfClassSubjects(newListOfClassSubjects));

    setIsDeleteModal(false);
    setDeletedRow(dummyClassSubjectData);
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setCreatedRow(dummyClassSubjectData);
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdClassSubject = await postClassSubject({
      "ClassId": createdRow.ClassId,
      "ClassName": createdRow.ClassName,
      "NumOfStudent": createdRow.NumOfStudent,
      "TeacherName": createdRow.TeacherName,
      "Semester": createdRow.Semester,
      "Schoolyear": createdRow.Schoolyear,
      "SubjectId": createdRow.SubjectId
    })

    if (createdClassSubject) {
      const newListOfClassSubjects: IClassSubjectType[] = await getClassSubjects();
      if (newListOfClassSubjects) {
        dispatch(setSnackbarMessage("Tạo thông tin lớp học phần mới thành công"));
        dispatch(setListOfClassSubjects(newListOfClassSubjects));
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
        renderTopToolbarCustomActions={() => (
          <h3 style={{ "margin": "0px" }}>
            <b><KeyboardArrowRightIcon
              style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
            ></KeyboardArrowRightIcon></b>
            <span>Thông tin lớp học phần</span>
          </h3>
        )}
        renderRowActions={({ row, table }) => (
          <>
            <Tooltip arrow placement="left" title="Sửa thông tin lớp học phần">
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá thông tin lớp học phần">
              <IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        )}
        renderBottomToolbarCustomActions={() => (
          <Tooltip title="Tạo lớp học phần mới" placement="right-start">
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
        <DialogTitle textAlign="center"><b>Sửa thông tin lớp học phần</b></DialogTitle>
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
                if (column.id === "SubjectName" && subjectData.length > 0) {
                  const subjectOptions: string[] = subjectData.map(x => x.SubjectName.toString());

                  return <FormControl sx={{ m: 0, minWidth: 120 }}>
                    <InputLabel id="subject-select-required-label">Môn học</InputLabel>
                    <Select
                      labelId="subject-select-required-label"
                      id="subject-select-required"
                      value={subjectData.findIndex(x => x.SubjectId === updatedRow.SubjectId) > -1 ?
                        subjectData.findIndex(x => x.SubjectId === updatedRow.SubjectId).toString() : ""}
                      label="Phòng ban"
                      onChange={(e: SelectChangeEvent) =>
                        setUpdatedRow({
                          ...updatedRow,
                          "SubjectName": subjectData[Number(e.target.value)].SubjectName,
                          "SubjectId": subjectData[Number(e.target.value)].SubjectId
                        })}
                    >
                      {subjectOptions.map((x, idx) => <MenuItem value={idx}>{x}</MenuItem>)}
                    </Select>
                  </FormControl>
                } if (column.id === "ClassId") {
                  return <TextField
                    disabled
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={column.id && updatedRow[column.id]}
                  />
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
        <DialogTitle textAlign="center"><b>Xoá thông tin lớp học phần</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin lớp học phần {`${deletedRow.ClassName}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Huỷ</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
        <DialogTitle textAlign="center"><b>Tạo thông tin lớp học phần</b></DialogTitle>
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
                if (column.id === "SubjectName" && subjectData.length > 0) {
                  const subjectOptions: string[] = subjectData.map(x => x.SubjectName.toString());

                  return <FormControl sx={{ m: 0, minWidth: 120 }}>
                    <InputLabel id="subject-select-required-label">Môn học</InputLabel>
                    <Select
                      labelId="subject-select-required-label"
                      id="subject-select-required"
                      value={subjectData.findIndex(x => x.SubjectId === createdRow.SubjectId) > -1 ?
                        subjectData.findIndex(x => x.SubjectId === createdRow.SubjectId).toString() : ""}
                      label="Phòng ban"
                      onChange={(e: SelectChangeEvent) =>
                        setCreatedRow({
                          ...createdRow,
                          "SubjectName": subjectData[Number(e.target.value)].SubjectName,
                          "SubjectId": subjectData[Number(e.target.value)].SubjectId
                        })}
                    >
                      {subjectOptions.map((x, idx) => <MenuItem value={idx}>{x}</MenuItem>)}
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

export default ClassSubjectTable;
