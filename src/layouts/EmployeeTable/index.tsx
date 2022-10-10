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

const EmployeeTable: FC = () => {
  const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IEmployeeType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyEmployeeData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyEmployeeData);
  const [createdRow, setCreatedRow] = useState<any>(dummyEmployeeData);

  const getTableData = async () => {
    const listOfEmployees: IEmployeeType[] = await getEmployees();
    if (listOfEmployees) {
      dispatch(setListOfEmployees(listOfEmployees));
    }
  }

  useEffect(() => {
    getTableData();
  }, [])

  useEffect(() => {
    let formatedEmployeeData = employeeData.map((emp) => {
      return {
        ...emp,
        "Birthday": moment(emp.Birthday).format("DD/MM/YYYY")
      }
    })
    setTableData(formatedEmployeeData);
  }, [employeeData])

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
        accessorKey: 'EmployeeID',
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
        accessorKey: 'Birthday',
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
        accessorKey: 'DepartmentId',
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
    const isUpdatedSuccess = await updateEmployee(updatedRow);
    if (isUpdatedSuccess) {
      let updatedIdx = employeeData.findIndex(x => x.EmployeeID === updatedRow.EmployeeID);
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
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deleteEmployee(deletedRow.EmployeeID);

    let deletedIdx = employeeData.findIndex(x => x.EmployeeID === deletedRow.EmployeeID);
    let newListOfEmployees = [...employeeData.slice(0, deletedIdx), ...employeeData.slice(deletedIdx + 1,)]
    dispatch(setListOfEmployees(newListOfEmployees));

    setIsDeleteModal(false);
    setDeletedRow(dummyEmployeeData);
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdEmployee = await postEmployee({
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
          </Box>
        )}
        renderBottomToolbarCustomActions={() => (
          <Button
            color="primary"
            onClick={handleOpenCreateModal}
            variant="contained"
            style={{ "margin": "10px" }}
          >
            Tạo nhân viên mới
          </Button>
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
                if (column.id === "EmployeeID") {
                  return <TextField
                    disabled
                    key="EmployeeID"
                    label="EmployeeID"
                    name="EmployeeID"
                    defaultValue={updatedRow["EmployeeID"]}
                  />
                } else if (column.id === "Birthday") {
                  console.log("updatedRow :", updatedRow)
                  return <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Ngày sinh"
                      value={moment(updatedRow.Birthday, 'DD/MM/YYYY')}
                      onChange={(val: any) =>
                        setUpdatedRow({ ...updatedRow, "Birthday": moment(val).format("DD/MM/YYYY") })
                      }
                      renderInput={(params: any) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                } else if (column.id === "Gender") {
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
                      {Object.values(Genders).slice(0, (Object.values(Genders).length + 1) / 2).map((x, idx) => <MenuItem value={idx}>{x}</MenuItem>)}
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
        <DialogTitle textAlign="center"><b>Xoá thông tin nhân viên</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin nhân viên {`${deletedRow.EmployeeID}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Huỷ</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
        <DialogTitle textAlign="center"><b><AddIcon /></b></DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              {columns.slice(1,).map((column) => (
                column.id === "Birthday" ?
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Ngày sinh"
                      value={createdRow.Birthday}
                      onChange={(val: any) =>
                        setCreatedRow({ ...createdRow, "Birthday": val })
                      }
                      renderInput={(params: any) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  :
                  (column.id === "Gender" ?
                    <FormControl sx={{ m: 0, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-required-label">Giới tính</InputLabel>
                      <Select
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={Genders[createdRow.Gender]}
                        label="Giới tính"
                        onChange={(e: SelectChangeEvent) =>
                          setCreatedRow({ ...createdRow, "Gender": Genders[Number(e.target.value)] })}
                      >
                        {Object.values(Genders).slice(0, (Object.values(Genders).length + 1) / 2).map((x, idx) => <MenuItem value={idx}>{x}</MenuItem>)}

                      </Select>
                    </FormControl>
                    :
                    <TextField
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      defaultValue={column.id && updatedRow[column.id]}
                      onChange={(e) =>
                        setCreatedRow({ ...createdRow, [e.target.name]: e.target.value })
                      }
                    />)
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

export default EmployeeTable;
