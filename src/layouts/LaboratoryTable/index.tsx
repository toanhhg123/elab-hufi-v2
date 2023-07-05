import React, { FC, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from 'material-react-table';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  TextareaAutosize,
  TableRow,
  TableCell,
  CircularProgress,
  Typography
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { dummyLaboratoryData, ILaboratoryType } from '../../types/laboratoryType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteLaboratory, getLaboratories, postLaboratory, updateLaboratory } from '../../services/laboratoryServices';
import { RootState } from '../../store';
import { setListOfLaboratories } from './laboratorySlice';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { setSnackbarMessage } from '../../pages/appSlice';
import DeviceInLaboratoryTable from './DeviceInLaboratoryTable';
import InstrumentInLaboratoryTable from './InstrumentInLaboratoryTable';
import { ColumnType } from './Utils';

const LaboratoryTable: FC = () => {
  const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
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
  const [loading, setLoading] = useState<Boolean>(true);

  const timeoutRequestingLabData = () => setTimeout(() => {
    setLoading(false);
  }, 5000)

  useEffect(() => {
    timeoutRequestingLabData();
    if (laboratoriesData.length > 0) {
      setTableData(laboratoriesData);
      setLoading(false);
    }
    return () => {
      clearTimeout(timeoutRequestingLabData());
    }
  }, [laboratoriesData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<ILaboratoryType>,
    ): MRT_ColumnDef<ILaboratoryType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<ILaboratoryType>[]>(
    () => [
      {
        accessorKey: 'LabId',
        header: 'Mã phòng lab',
        size: 100,
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

  const deviceInLaboratoryTableColumns = useRef<ColumnType[]>([
    {
      id: 'DeviceInfoId',
      header: 'Mã TB',
    },
    {
      id: 'SerialNumber',
      header: 'Số seri',
    },
    {
      id: 'DeviceName',
      header: 'Tên TB',
    },
    {
      id: 'Unit',
      header: 'Đơn vị',
    },
    {
      id: 'ManufacturingDate',
      header: 'NSX',
      type: 'date'
    },
    {
      id: 'StartGuarantee',
      header: 'Ngày BĐ bảo dưỡng',
      type: 'date'
    },
    {
      id: 'EndGuarantee',
      header: 'Ngày KT bảo dưỡng',
      type: 'date'
    },
    {
      id: 'DateStartUsage',
      header: 'Ngày BĐ sử dụng',
      type: 'date'
    },
    {
      id: 'HoursUsageTotal',
      header: 'Số giờ sử dụng',
      renderValue: (HoursUsageTotal) => `${HoursUsageTotal} (h)`
    },
    {
      id: 'PeriodicMaintenance',
      header: 'Chu kỳ bảo dưỡng',
      renderValue: (PeriodicMaintenance) => `${PeriodicMaintenance} (tháng)`
    },
    {
      id: 'Status',
      header: 'Tình trạng',
    },
  ]);

  const instrumentInLaboratoryTableColumns = useRef<ColumnType[]>([
    {
      id: 'InstrumentDeptId',
      header: 'Mã dụng cụ',
    },
    {
      id: 'DeviceName',
      header: 'Tên dụng cụ',
    },
    {
      id: 'Quantity',
      header: 'Số lượng',
      renderValue: (Quantity, Unit) => `${Quantity} (${Unit})`
    }
  ])

  const handleOpenEditModal = (row: any) => {
    setUpdatedRow(row.original);
    setIsEditModal(true);
  }

  const onCloseEditModal = () => {
    setUpdatedRow(dummyLaboratoryData);
    setIsEditModal(false);
  }

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updateLaboratory(updatedRow.LabId, updatedRow);
    if (isUpdatedSuccess) {
      dispatch(setSnackbarMessage("Cập nhật thông tin phòng lab thành công"));
      let updatedIdx = laboratoriesData.findIndex(x => x.LabId === updatedRow.LabId);
      let newListOfLabs = [...laboratoriesData.slice(0, updatedIdx), updatedRow, ...laboratoriesData.slice(updatedIdx + 1,)]
      dispatch(setListOfLaboratories(newListOfLabs));
    }

    onCloseEditModal();
  }

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    setDeletedRow(dummyLaboratoryData);
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deleteLaboratory(deletedRow.LabId);
    dispatch(setSnackbarMessage("Xóa thông tin phòng lab thành công"));
    let deletedIdx = laboratoriesData.findIndex(x => x.LabId === deletedRow.LabId);
    let newListOfLabs = [...laboratoriesData.slice(0, deletedIdx), ...laboratoriesData.slice(deletedIdx + 1,)]
    dispatch(setListOfLaboratories(newListOfLabs));

    onCloseDeleteModal();
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setCreatedRow(dummyLaboratoryData);
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdLab = await postLaboratory({
      "LabName": createdRow.LabName,
      "Location": createdRow.Location,
      "Note": createdRow.Note,
      "listDevice": [],
      "listInstrument": []
    })
    if (createdLab) {
      const newListOfLaboratories: ILaboratoryType[] = await getLaboratories();
      if (newListOfLaboratories) {
        dispatch(setSnackbarMessage("Tạo thông tin phòng lab mới thành công"));
        dispatch(setListOfLaboratories(newListOfLaboratories));
      }
    }
    onCloseCreateModal();
  }

  return (
    <>
      {loading ? (
        <CircularProgress disableShrink sx={{ marginTop: '50px' }} />
      ) :
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
              'mrt-row-expand',
              'mrt-row-numbers',
              ...columns.map(x => x.accessorKey || ''),
              'mrt-row-actions'
            ]
          }}
          renderDetailPanel={({ row }) => (
            <>
              <DeviceInLaboratoryTable
                deviceData={row.original.listDevice}
                columns={deviceInLaboratoryTableColumns.current}
                row={row}
              />
              <InstrumentInLaboratoryTable
                instrumentData={row.original.listInstrument}
                columns={instrumentInLaboratoryTableColumns.current}
                row={row}
              />
            </>
          )}
          renderTopToolbarCustomActions={() => (
            <h3 style={{ "margin": "0px" }}>
              <b><KeyboardArrowRightIcon
                style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
              ></KeyboardArrowRightIcon></b>
              <span>Thông tin phòng lab</span>
            </h3>
          )}
          renderRowActions={({ row, table }) => (
            <>
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
            </>
          )}
          renderBottomToolbarCustomActions={() => (
            <Tooltip title="Tạo Lab mới" placement="right-start">
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
      }
      {!loading && laboratoriesData.length === 0 && (
        <TableRow>
          <TableCell colSpan={10} sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom align="center" component="div">
              Trống
            </Typography>
          </TableCell>
        </TableRow>
      )}

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
                column.id === "Note" ?
                  <TextareaAutosize
                    key={"EditNote"}
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="Nhập ghi chú..."
                    defaultValue={updatedRow["Note"]}
                    onChange={(e) =>
                      setUpdatedRow({ ...updatedRow, "Note": e.target.value })
                    }
                  />
                  : <TextField
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
        <DialogTitle textAlign="center"><b>Xoá thông tin Lab</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin Lab {`${deletedRow.LabName}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
        <DialogTitle textAlign="center"><b>Tạo thông tin Lab mới</b></DialogTitle>
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
                column.id === "Note" ?
                  <TextareaAutosize
                    key={"CreateNote"}
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="Nhập ghi chú..."
                    defaultValue={createdRow["Note"]}
                    onChange={(e) =>
                      setCreatedRow({ ...createdRow, "Note": e.target.value })
                    } />
                  :
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

export default React.memo(LaboratoryTable);
