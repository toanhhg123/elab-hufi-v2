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
  Tooltip
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { dummyEmployeeData, IEmployeeType } from '../../types/employeeType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteEmployee, getEmployees, postEmployee, updateEmployee } from '../../services/employeeServices';
import { RootState } from '../../store';
import { setListOfEmployees } from './employeeSlice';
import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Genders } from '../../configs/enums';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { setSnackbarMessage } from '../../pages/appSlice';

const EmployeeTable: FC = () => {
  const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
  const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IEmployeeType[]>([]);
  const [departmentDataValue, setDepartmentDataValue] = useState<any>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyEmployeeData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyEmployeeData);
  const [createdRow, setCreatedRow] = useState<any>(dummyEmployeeData);

  useEffect(() => {
    let formatedEmployeeData = employeeData.length > 0 ? employeeData.map((emp: IEmployeeType) => {
      let departmentInfoIdx = departmentData.findIndex(y => y.DepartmentId === emp.DepartmentId);
      return {
        ...emp,
        "formatedBirthday": moment.unix(emp.Birthday).format('DD/MM/YYYY'),
        "DepartmentName": departmentInfoIdx > -1 ? departmentData[departmentInfoIdx].DepartmentName : ""
      }
    }) : [];
    setTableData(formatedEmployeeData);
  }, [employeeData])

  useEffect(() => {
    if (departmentData.length > 0) {
      const list = departmentData.map(x => ({
        label: `${x.DepartmentId} - ${x.DepartmentName}`,
        id: x.DepartmentId,
        name: x.DepartmentName
      }));
      setDepartmentDataValue(list);
    }
  }, [departmentData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IEmployeeType>,
    ): MRT_ColumnDef<IEmployeeType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IEmployeeType>[]>(
    () => [
      {
        accessorKey: 'EmployeeId',
        header: 'ID',
        enableColumnOrdering: true,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 50,
      },
      {
        accessorKey: 'Fullname',
        header: 'Họ và tên',
        size: 100,
      },
      {
        accessorKey: 'formatedBirthday',
        header: 'Ngày sinh',
        size: 140,
      },
      {
        accessorKey: 'Gender',
        header: 'Giới tính',
        size: 140,
      },
      {
        accessorKey: 'Address',
        header: 'Địa chỉ',
        size: 140,
      },
      {
        accessorKey: 'Email',
        header: 'Email',
        size: 140,
      },
      {
        accessorKey: 'PhoneNumber',
        header: 'Số điện thoại',
        size: 50,
      },
      {
        accessorKey: 'DepartmentName',
        header: 'Phòng ban',
        size: 50,
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
    const isUpdatedSuccess = await updateEmployee({
      "EmployeeId": updatedRow.EmployeeId,
      "Fullname": updatedRow.Fullname,
      "Birthday": updatedRow.Birthday,
      "Gender": updatedRow.Gender,
      "Address": updatedRow.Address,
      "Email": updatedRow.Email,
      "PhoneNumber": updatedRow.PhoneNumber,
      "DepartmentId": updatedRow.DepartmentId
    });
    if (isUpdatedSuccess) {
      dispatch(setSnackbarMessage("Cập nhật thông tin nhân viên thành công"));
      let updatedIdx = employeeData.findIndex(x => x.EmployeeId === updatedRow.EmployeeId);
      let newListOfEmployees = [...employeeData.slice(0, updatedIdx), updatedRow, ...employeeData.slice(updatedIdx + 1,)]
      dispatch(setListOfEmployees(newListOfEmployees));
    }

    setIsEditModal(false);
    setUpdatedRow(dummyEmployeeData);
  }

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    setDeletedRow(dummyEmployeeData);
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deleteEmployee(deletedRow.EmployeeId);
    dispatch(setSnackbarMessage("Xóa thông tin nhân viên thành công"));
    let deletedIdx = employeeData.findIndex(x => x.EmployeeId === deletedRow.EmployeeId);
    let newListOfEmployees = [...employeeData.slice(0, deletedIdx), ...employeeData.slice(deletedIdx + 1,)]
    dispatch(setListOfEmployees(newListOfEmployees));

    onCloseDeleteModal();
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdEmployee = await postEmployee({
      "EmployeeId": createdRow.EmployeeId,
      "Fullname": createdRow.Fullname,
      "Birthday": createdRow.Birthday,
      "Gender": createdRow.Gender,
      "Address": createdRow.Address,
      "Email": createdRow.Email,
      "PhoneNumber": createdRow.PhoneNumber,
      "DepartmentId": createdRow.DepartmentId
    })
    if (createdEmployee) {
      const newListOfEmployees: IEmployeeType[] = await getEmployees();
      if (newListOfEmployees) {
        dispatch(setSnackbarMessage("Tạo thông tin nhân viên mới thành công"));
        dispatch(setListOfEmployees(newListOfEmployees));
      }
    }
    setIsCreateModal(false);
    setCreatedRow(dummyEmployeeData);
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
            <Tooltip arrow placement="left" title="Sửa thông tin nhân viên">
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá nhân viên">
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
            <span>Thông tin nhân viên</span>
          </h3>
        )}
        renderBottomToolbarCustomActions={() => (
          <Tooltip title="Tạo nhân viên mới" placement="right-start">
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
        <DialogTitle textAlign="center"><b>Sửa thông tin nhân viên</b></DialogTitle>
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
                if (column.accessorKey === "EmployeeId") {
                  return <TextField
                    disabled
                    key="EmployeeId"
                    label="EmployeeId"
                    name="EmployeeId"
                    defaultValue={updatedRow["EmployeeId"]}
                  />
                }
                else if (column.accessorKey === "formatedBirthday") {
                  return <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      key={"UpdateBirthday"}
                      label="Ngày sinh"
                      value={new Date(updatedRow.Birthday * 1000)}
                      onChange={(val: any) =>
                        setUpdatedRow({
                          ...updatedRow,
                          "formatedBirthday": moment.unix(Date.parse(val) / 1000).format('DD/MM/YYYY'),
                          "Birthday": Date.parse(val) / 1000
                        })
                      }
                      renderInput={(params: any) => <TextField key={"UpdateBirthdayTextField"} {...params} />}
                      inputFormat='DD/MM/YYYY'
                    />
                  </LocalizationProvider>
                }
                else if (column.accessorKey === "Gender") {
                  return <FormControl sx={{ m: 0, minWidth: 120 }}>
                    <InputLabel id="edit-select-required">Giới tính</InputLabel>
                    <Select
                      labelId="edit-select-required"
                      id="edit-select-required"
                      value={Genders[updatedRow.Gender]}
                      label="Giới tính"
                      onChange={(e: SelectChangeEvent) =>
                        setUpdatedRow({ ...updatedRow, "Gender": Genders[Number(e.target.value)] })}
                    >
                      {Object.values(Genders).slice(0, (Object.values(Genders).length + 1) / 2)
                        .map((x, idx) => <MenuItem key={'UpdateGender' + idx} value={idx}>{x}</MenuItem>)}
                    </Select>
                  </FormControl>
                }
                else if (column.accessorKey === "DepartmentName" && departmentData.length > 0) {
                  return (
                    <Autocomplete
                      key={"UpdatedDepartmentName"}
                      options={departmentDataValue}
                      noOptionsText="Không có kết quả trùng khớp"
                      value={departmentDataValue.find((x: any) => x.id === updatedRow.DepartmentId) || null}
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
                          "DepartmentId": value?.id,
                          "DepartmentName": value?.name,
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
          <Button onClick={onCloseEditModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitEditModal} variant="contained">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteModal}>
        <DialogTitle textAlign="center"><b>Xoá thông tin nhân viên</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin nhân viên {`${deletedRow.EmployeeId}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
        <DialogTitle textAlign="center"><b>Tạo nhân viên mới</b></DialogTitle>
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
                if (column.accessorKey === "formatedBirthday") {
                  return <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      key={"CreateBirthday"}
                      label="Ngày sinh"
                      value={new Date(createdRow.Birthday * 1000)}
                      onChange={(val: any) =>
                        setCreatedRow({
                          ...createdRow,
                          "formatedBirthday": moment.unix(Date.parse(val) / 1000).format('DD/MM/YYYY'),
                          "Birthday": Date.parse(val) / 1000
                        })
                      }
                      renderInput={(params: any) => <TextField key={"CreateBirthdayTextField"} {...params} />}
                      inputFormat='DD/MM/YYYY'
                    />
                  </LocalizationProvider>
                } 
                else if (column.accessorKey === "Gender") {
                  return <FormControl sx={{ m: 0, minWidth: 120 }}>
                    <InputLabel id="edit-select-required">Giới tính</InputLabel>
                    <Select
                      labelId="edit-select-required"
                      id="edit-select-required"
                      value={Genders[createdRow.Gender]}
                      label="Giới tính"
                      onChange={(e: SelectChangeEvent) =>
                        setCreatedRow({ ...createdRow, "Gender": Genders[Number(e.target.value)] })}
                    >
                      {Object.values(Genders).slice(0, (Object.values(Genders).length + 1) / 2)
                        .map((x, idx) => <MenuItem key={"CreateGender" + idx} value={idx}>{x}</MenuItem>)}
                    </Select>
                  </FormControl>
                }
                else if (column.accessorKey === "DepartmentName" && departmentData.length > 0) {
                  return (
                    <Autocomplete
                      key={"CreatedDepartmentName"}
                      options={departmentDataValue}
                      noOptionsText="Không có kết quả trùng khớp"
                      value={departmentDataValue.find((x: any) => x.id === createdRow.DepartmentId) || null}
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
                          "DepartmentId": value?.id,
                          "DepartmentName": value?.name,
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
              }
              )}

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

export default EmployeeTable;
