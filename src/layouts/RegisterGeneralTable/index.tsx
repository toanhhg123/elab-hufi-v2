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
import { dummyRegisterGeneralData, IRegisterGeneralType } from '../../types/registerGeneralType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  deleteRegisterGeneral,
  getRegisterGenerals,
  postRegisterGeneral,
  updateRegisterGeneral
} from '../../services/registerGeneralServices';
import { RootState } from '../../store';
import { setListOfRegisterGenerals } from './registerGeneralSlice';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { setSnackbarMessage } from '../../pages/appSlice';

const RegisterGeneralsTable: FC = () => {
  const registerGeneralsData = useAppSelector((state: RootState) => state.registerGeneral.listOfRegisterGenerals);
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IRegisterGeneralType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyRegisterGeneralData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyRegisterGeneralData);
  const [createdRow, setCreatedRow] = useState<any>(dummyRegisterGeneralData);

  useEffect(() => {
    setTableData(registerGeneralsData);
  }, [registerGeneralsData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IRegisterGeneralType>,
    ): MRT_ColumnDef<IRegisterGeneralType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IRegisterGeneralType>[]>(
    () => [
      {
        accessorKey: 'RegisterGeneralId',
        header: 'Mã phiếu ĐK',
      },
      {
        accessorKey: 'DateCreate',
        header: 'Ngày tạo',
      },
      {
        accessorKey: 'Instructor',
        header: 'Người HD',
      },
      {
        accessorKey: 'ThesisName',
        header: 'Tên luận văn',
      },
      {
        accessorKey: 'ResearchSubject',
        header: 'Chủ đề nghiên cứu',
      },
      {
        accessorKey: 'StartDate',
        header: 'Ngày BĐ',
      },
      {
        accessorKey: 'EndDate',
        header: 'Ngày KT',
      },
      {
        accessorKey: 'ResearcherId',
        header: 'Mã nghiên cứu viên',
      },
      {
        accessorKey: 'ResearcherName',
        header: 'Tên nghiên cứu viên',
      },
      {
        accessorKey: 'EmployeeId',
        header: 'Mã nhân viên',
      },
      {
        accessorKey: 'EmployeeName',
        header: 'Tên nhân viên',
      },
    ],
    [getCommonEditTextFieldProps],
  );

  const handleOpenEditModal = (row: any) => {
    setUpdatedRow(row.original);
    setIsEditModal(true);
  }

  const onCloseEditModal = () => {
    setUpdatedRow(dummyRegisterGeneralData);
    setIsEditModal(false);
  }

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updateRegisterGeneral(updatedRow);
    if (isUpdatedSuccess) {
      dispatch(setSnackbarMessage("Cập nhật thông tin phiếu đăng ký chung thành công"));
      let updatedIdx = registerGeneralsData.findIndex(x => x.RegisterGeneralId === updatedRow.RegisterGeneralId);
      let newListOfRegisterGenerals = [...registerGeneralsData.slice(0, updatedIdx), updatedRow, ...registerGeneralsData.slice(updatedIdx + 1,)]
      dispatch(setListOfRegisterGenerals(newListOfRegisterGenerals));
    }

    onCloseEditModal();
  }

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    setDeletedRow(dummyRegisterGeneralData);
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deleteRegisterGeneral(deletedRow.RegisterGeneralId);
    dispatch(setSnackbarMessage("Xóa thông tin phiếu đăng ký chung thành công"));
    let deletedIdx = registerGeneralsData.findIndex(x => x.RegisterGeneralId === deletedRow.RegisterGeneralId);
    let newListOfRegisterGenerals = [...registerGeneralsData.slice(0, deletedIdx), ...registerGeneralsData.slice(deletedIdx + 1,)]
    dispatch(setListOfRegisterGenerals(newListOfRegisterGenerals));

    onCloseDeleteModal();
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setCreatedRow(dummyRegisterGeneralData);
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    // const createdRegisterGeneral = await postRegisterGeneral({
    //   "Name": createdRow.Name,
    //   "Email": createdRow.Email,
    //   "PhoneNumber": createdRow.PhoneNumber,
    //   "Address": createdRow.Address,
    // })
    // if (createdRegisterGeneral) {
    //   const newListOfRegisterGenerals: IRegisterGeneralType[] = await getRegisterGenerals();
    //   if (newListOfRegisterGenerals) {
    //     dispatch(setSnackbarMessage("Tạo thông tin phiếu đăng ký chung mới thành công"));
    //     dispatch(setListOfRegisterGenerals(newListOfRegisterGenerals));
    //   }
    // }
    // onCloseCreateModal();
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
            <Tooltip arrow placement="left" title="Sửa thông tin phiếu đăng ký chung">
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá thông tin phiếu đăng ký chung">
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
            <span>Danh mục cung cấp</span>
          </h3>
        )}
        renderBottomToolbarCustomActions={() => (
          <Tooltip title="Tạo phiếu đăng ký chung mới" placement="right-start">
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
        <DialogTitle textAlign="center"><b>Sửa thông tin phiếu đăng ký chung</b></DialogTitle>
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
                column.id === "SupplierId" ?
                  <TextField
                    disabled
                    key="SupplierId"
                    label="SupplierId"
                    name="SupplierId"
                    defaultValue={updatedRow["SupplierId"]}
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
          <Button onClick={onCloseEditModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitEditModal} variant="contained">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteModal}>
        <DialogTitle textAlign="center"><b>Xoá thông tin phiếu đăng ký chung</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin phiếu đăng ký chung {`${deletedRow.Name}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
        <DialogTitle textAlign="center"><b>Tạo thông tin phiếu đăng ký chung</b></DialogTitle>
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
          <Button onClick={onCloseCreateModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitCreateModal} variant="contained">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default React.memo(RegisterGeneralsTable);
