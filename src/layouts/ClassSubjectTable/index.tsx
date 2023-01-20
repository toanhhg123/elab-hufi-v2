import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from 'material-react-table';
import {
  Autocomplete,
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

const semesterValue = ['1', '2', '3'];
const schoolYearValue = ['2020-2021', '2021-2022', '2022-2023'];

const ClassSubjectTable: FC = () => {
  const classSubjectData = useAppSelector((state: RootState) => state.classSubject.listOfClassSubjects);
  const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
  const subjectData = useAppSelector((state: RootState) => state.subject.listOfSubjects);
  const dispatch = useAppDispatch();

  const [subjectDataValue, setSubjectDataValue] = useState<any>([]);
  const [employeeDataValue, setEmployeeDataValue] = useState<any>([]);
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
    if (subjectData.length > 0) {
      const list = subjectData.map(x => ({
        label: `${x.SubjectId} - ${x.SubjectName}`,
        id: x.SubjectId,
        name: x.SubjectName
      }));
      setSubjectDataValue(list);
    }
  }, [subjectData])

  useEffect(() => {
    if (employeeData.length > 0) {
      const list = employeeData.map(x => ({
        label: `${x.EmployeeId} - ${x.Fullname}`,
        id: x.EmployeeId,
        name: x.Fullname
      }));
      setEmployeeDataValue(list);
    }
  }, [employeeData])

  useEffect(() => {
    let formatedClassSubjectData = classSubjectData.length > 0 ? classSubjectData.map((x: IClassSubjectType) => {
      let subjectInfoIdx = subjectData.findIndex(y => y.SubjectId === x.SubjectId);
      return {
        ...x,
        "SubjectName": subjectInfoIdx > -1 ? subjectData[subjectInfoIdx].SubjectName : ""
      }
    }) : [];

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
        accessorKey: 'ClassCode',
        header: 'Mã LHP',
        size: 140,
      },
      {
        accessorKey: 'ClassName',
        header: 'Tên LHP',
        size: 140,
      },
      {
        accessorKey: 'NumOfStudent',
        header: 'Số lượng sinh viên',
        size: 140,
      },
      {
        accessorKey: 'EmployeeName',
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
      "ClassCode": updatedRow.ClassCode,
      "ClassName": updatedRow.ClassName,
      "NumOfStudent": updatedRow.NumOfStudent,
      "EmployeeName": updatedRow.EmployeeName,
      "EmployeeId": updatedRow.EmployeeId,
      "Semester": updatedRow.Semester,
      "Schoolyear": updatedRow.Schoolyear,
      "SubjectId": updatedRow.SubjectId,
      "SubjectName": updatedRow.SubjectName
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
      "ClassCode": createdRow.ClassCode,
      "ClassName": createdRow.ClassName,
      "NumOfStudent": createdRow.NumOfStudent,
      "EmployeeId": createdRow.EmployeeId,
      "EmployeeName": createdRow.EmployeeName,
      "Semester": createdRow.Semester,
      "Schoolyear": createdRow.Schoolyear,
      "SubjectId": createdRow.SubjectId,
      "SubjectName": createdRow.SubjectName
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
                if (column.accessorKey === "SubjectName") {
                  return (
                    <Autocomplete
                      key={"UpdateSubjectName"}
                      options={subjectDataValue}
                      noOptionsText="Không có kết quả trùng khớp"
                      value={subjectDataValue.find((x: any) => x.id === updatedRow.SubjectId) || null}
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
                        setUpdatedRow({
                          ...updatedRow,
                          "SubjectId": value?.id,
                          "SubjectName": value?.name,
                        });
                      }}
                    />
                  );
                }
                else if (column.accessorKey === "EmployeeName") {
                  return (
                    <Autocomplete
                      key={'UpdateEmployeeName'}
                      options={employeeDataValue}
                      noOptionsText="Không có kết quả trùng khớp"
                      value={employeeDataValue.find((x: any) => x.id === updatedRow.EmployeeId) || null}
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
                        setUpdatedRow({
                          ...updatedRow,
                          "EmployeeId": value?.id,
                          "EmployeeName": value?.name,
                        });
                      }}
                    />
                  );
                }
                else if (column.accessorKey === "ClassId") {
                  return <TextField
                    disabled
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={column.id && updatedRow[column.accessorKey]}
                  />
                }
                else if (column.accessorKey === "Semester") {
                  return <FormControl key={"updateSemester"}>
                    <InputLabel id="Semester-select-required-autoSchedule">Học kỳ</InputLabel>
                    <Select
                      labelId="Semester-select-required-autoSchedule"
                      id="Semester-select-required-autoSchedule"
                      value={updatedRow.Semester}
                      label="Học kỳ"
                      onChange={(e: SelectChangeEvent) => {
                        setUpdatedRow({
                          ...updatedRow,
                          "Semester": e.target.value
                        })
                      }}
                    >
                      {semesterValue.map((x, idx) => (
                        <MenuItem key={idx} value={x}>
                          {x}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
                else if (column.accessorKey === 'Schoolyear') {
                  return <FormControl key={"createSchoolyear"}>
                    <InputLabel id="updateSchoolyear-select-required">Năm học</InputLabel>
                    <Select
                      labelId="updateSchoolyear-select-required"
                      id="updateSchoolyear-select-required"
                      value={updatedRow.Schoolyear}
                      label="Năm học"
                      onChange={(e: SelectChangeEvent) => {
                        setUpdatedRow({
                          ...updatedRow,
                          "Schoolyear": e.target.value
                        })
                      }}
                    >
                      {schoolYearValue.map((x, idx) => (
                        <MenuItem key={"updateSchoolyear" + idx} value={x}>
                          {x}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
                else {
                  return <TextField
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={column.accessorKey && updatedRow[column.accessorKey]}
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
          <Button onClick={onCloseEditModal}>Hủy</Button>
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
          <Button onClick={onCloseDeleteModal}>Hủy</Button>
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
                if (column.accessorKey === "SubjectName") {
                  return (
                    <Autocomplete
                      key={"CreateSubjectName"}
                      options={subjectDataValue}
                      noOptionsText="Không có kết quả trùng khớp"
                      value={subjectDataValue.find((x: any) => x.id === createdRow.SubjectId) || null}
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
                        setCreatedRow({
                          ...createdRow,
                          "SubjectId": value?.id,
                          "SubjectName": value?.name,
                        });
                      }}
                    />
                  );
                }
                else if (column.accessorKey === "Semester") {
                  return <FormControl key={"createSemester"}>
                    <InputLabel id="createSemester-select-required">Học kỳ</InputLabel>
                    <Select
                      labelId="createSemester-select-required"
                      id="createSemester-select-required"
                      value={createdRow.Semester}
                      label="Học kỳ"
                      onChange={(e: SelectChangeEvent) => {
                        setCreatedRow({
                          ...createdRow,
                          "Semester": e.target.value
                        })
                      }}
                    >
                      {semesterValue.map((x, idx) => (
                        <MenuItem key={"createSemester" + idx} value={x}>
                          {x}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
                else if (column.accessorKey === 'Schoolyear') {
                  return <FormControl key={"createSchoolyear"}>
                    <InputLabel id="createSchoolyear-select-required">Năm học</InputLabel>
                    <Select
                      labelId="createSchoolyear-select-required"
                      id="createSchoolyear-select-required"
                      value={createdRow.Schoolyear}
                      label="Năm học"
                      onChange={(e: SelectChangeEvent) => {
                        setCreatedRow({
                          ...createdRow,
                          "Schoolyear": e.target.value
                        })
                      }}
                    >
                      {schoolYearValue.map((x, idx) => (
                        <MenuItem key={"createSchoolyear" + idx} value={x}>
                          {x}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
                else if (column.accessorKey === "EmployeeName") {
                  return (
                    <Autocomplete
                      key={'CreateEmployeeName'}
                      options={employeeDataValue}
                      noOptionsText="Không có kết quả trùng khớp"
                      value={employeeDataValue.find((x: any) => x.id === createdRow.EmployeeId) || null}
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
                        setCreatedRow({
                          ...createdRow,
                          "EmployeeId": value?.id,
                          "EmployeeName": value?.name,
                        });
                      }}
                    />
                  );
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
              })}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseCreateModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitCreateModal} variant="contained">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default ClassSubjectTable;
