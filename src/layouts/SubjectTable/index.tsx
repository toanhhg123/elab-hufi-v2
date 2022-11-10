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
import { dummySubjectData, IChemicalsBelongingToSubjectType, IDevicesBelongingToSubjectType, ISubjectType } from '../../types/subjectType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteSubject, getSubjects, postSubject, updateSubject } from '../../services/subjectServices';
import { RootState } from '../../store';
import { setListOfSubjects } from './subjectSlice';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ScienceIcon from '@mui/icons-material/Science';
import ConstructionIcon from '@mui/icons-material/Construction';
import BuildIcon from '@mui/icons-material/Build';
import { setSnackbarMessage } from '../../pages/appSlice';
import DevicePlanning from './DevicePlanning';
import InstrumentPlanning from './InstrumentPlanning';
import ChemicalPlanning from './ChemicalPlanning';

const SubjectTable: FC = () => {
  const subjectData = useAppSelector((state: RootState) => state.subject.listOfSubjects);
  const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [isDevicePlanningModal, setIsDevicePlanningModal] = useState<boolean>(false);
  const [isChemicalPlanningModal, setIsChemicalPlanningModal] = useState<boolean>(false);
  const [isInstrumentPlanningModal, setIsInstrumentPlanningModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ISubjectType[]>([]);
  const [defaultDevicePlanning, setDefaultDevicePlanning] = useState<IDevicesBelongingToSubjectType[]>([]);
  const [defaultInstrumentPlanning, setDefaultInstrumentPlanning] = useState<IDevicesBelongingToSubjectType[]>([]);
  const [defaultChemicalPlanning, setDefaultChemicalPlanning] = useState<IChemicalsBelongingToSubjectType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummySubjectData);
  const [deletedRow, setDeletedRow] = useState<any>(dummySubjectData);
  const [createdRow, setCreatedRow] = useState<any>(dummySubjectData);
  const [selectedRow, setSelectedRow] = useState<any>(dummySubjectData);

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
      "DepartmentId": updatedRow.DepartmentId,
      "listChemical": updatedRow.listChemical,
      "listDevice": updatedRow.listDevice,
      "listInstrument": updatedRow.listInstrument
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
      "DepartmentId": createdRow.DepartmentId,
      "listChemical": createdRow.listChemical,
      "listDevice": createdRow.listDevice,
      "listInstrument": createdRow.listInstrument
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

  const handleOpenDevicePlanningModal = async (row: any) => {
    setSelectedRow(row.original);

    let devicePlanningData = subjectData.find((item: ISubjectType) => item.SubjectId === row.original.SubjectId)
    if (devicePlanningData) {
      setDefaultDevicePlanning(devicePlanningData.listDevice);
      setIsDevicePlanningModal(true);
    }
  }

  const onCloseDevicePlanningModal = () => {
    setSelectedRow(dummySubjectData);
    setIsDevicePlanningModal(false);
  }

  const onHandleSubmitDevicePlanningModal = async (DevicePlanningData: IDevicesBelongingToSubjectType[]) => {
    let updatedData = {
      ...selectedRow,
      listDevice: DevicePlanningData
    }

    await updateSubject(updatedData);
    let updatedIdx = subjectData.findIndex(x => x.SubjectId === updatedData.SubjectId);
    let updatedSubjectData = [...subjectData.slice(0, updatedIdx), updatedData, ...subjectData.slice(updatedIdx + 1,)];
    dispatch(setListOfSubjects(updatedSubjectData));
    dispatch(setSnackbarMessage("Cập nhật dự trù thiết bị thành công"));
    onCloseDevicePlanningModal();
  }

  const handleOpenChemicalPlanningModal = async (row: any) => {
    setSelectedRow(row.original);

    let devicePlanningData = subjectData.find((item: ISubjectType) => item.SubjectId === row.original.SubjectId)
    if (devicePlanningData) {
      setDefaultChemicalPlanning(devicePlanningData.listChemical);
      setIsChemicalPlanningModal(true);
    }
  }

  const onCloseChemicalPlanningModal = () => {
    setSelectedRow(dummySubjectData);
    setIsChemicalPlanningModal(false);
  }

  const onHandleSubmitChemicalPlanningModal = async (ChemicalPlanningData: IChemicalsBelongingToSubjectType[]) => {
    let updatedData = {
      ...selectedRow,
      listChemical: ChemicalPlanningData
    }

    await updateSubject(updatedData);
    let updatedIdx = subjectData.findIndex((x: ISubjectType) => x.SubjectId === updatedData.SubjectId);
    let updatedSubjectData = [...subjectData.slice(0, updatedIdx), updatedData, ...subjectData.slice(updatedIdx + 1,)];
    dispatch(setListOfSubjects(updatedSubjectData));
    dispatch(setSnackbarMessage("Cập nhật dự trù hoá chất thành công"));
    onCloseChemicalPlanningModal();
  }

  const handleOpenInstrumentPlanningModal = async (row: any) => {
    setSelectedRow(row.original);

    let devicePlanningData = subjectData.find((item: ISubjectType) => item.SubjectId === row.original.SubjectId)
    if (devicePlanningData) {
      setDefaultInstrumentPlanning(devicePlanningData.listInstrument);
      setIsInstrumentPlanningModal(true);
    }
  }

  const onCloseInstrumentPlanningModal = () => {
    setSelectedRow(dummySubjectData);
    setIsInstrumentPlanningModal(false);
  }

  const onHandleSubmitInstrumentPlanningModal = async (InstrumentPlanningData: IDevicesBelongingToSubjectType[]) => {
    let updatedData = {
      ...selectedRow,
      listInstrument: InstrumentPlanningData
    }

    await updateSubject(updatedData);
    let updatedIdx = subjectData.findIndex(x => x.SubjectId === updatedData.SubjectId);
    let updatedSubjectData = [...subjectData.slice(0, updatedIdx), updatedData, ...subjectData.slice(updatedIdx + 1,)];
    dispatch(setListOfSubjects(updatedSubjectData));
    dispatch(setSnackbarMessage("Cập nhật dự trù thiết bị thành công"));
    onCloseInstrumentPlanningModal();
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
          <Box sx={{
            "display": 'flex', "gap": '1rem', "justifyContent": "center",
            "alignItems": "center"
          }}>
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
            <Tooltip arrow placement="top" title="Dự trù hoá chất cho môn học">
              <IconButton style={{ "paddingLeft": "0px", "paddingRight": "0px" }} color="secondary" onClick={() => handleOpenChemicalPlanningModal(row)}>
                <ScienceIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Dự trù thiết bị cho môn học">
              <IconButton style={{ "paddingLeft": "0px" }} color="info" onClick={() => handleOpenDevicePlanningModal(row)}>
                <ConstructionIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Dự trù dụng cụ cho môn học">
              <IconButton style={{ "paddingLeft": "0px" }} color="warning" onClick={() => handleOpenInstrumentPlanningModal(row)}>
                <BuildIcon />
              </IconButton>
            </Tooltip>
          </Box>
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

      <DevicePlanning
        isOpen={isDevicePlanningModal}
        currentSubject={selectedRow}
        onClose={onCloseDevicePlanningModal}
        handleSubmit={onHandleSubmitDevicePlanningModal}
        defaultCurrentValue={defaultDevicePlanning}
      />

      <InstrumentPlanning
        isOpen={isInstrumentPlanningModal}
        currentSubject={selectedRow}
        onClose={onCloseInstrumentPlanningModal}
        handleSubmit={onHandleSubmitInstrumentPlanningModal}
        defaultCurrentValue={defaultInstrumentPlanning}
      />

      <ChemicalPlanning
        isOpen={isChemicalPlanningModal}
        currentSubject={selectedRow}
        onClose={onCloseChemicalPlanningModal}
        handleSubmit={onHandleSubmitChemicalPlanningModal}
        defaultCurrentValue={defaultChemicalPlanning}
      /> 
    </>
  );
};

export default SubjectTable;
