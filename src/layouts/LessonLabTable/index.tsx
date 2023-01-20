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
  ListItem,
  ListItemText,
  List,
  Typography
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import {
  dummyLessonLabData,
  IChemicalsBelongingToLessonLabType,
  IDevicesBelongingToLessonLab,
  ILessonLabType
} from '../../types/lessonLabType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteLessonLab, getLessonLabs, postLessonLab, updateLessonLab } from '../../services/lessonLabServices';
import { RootState } from '../../store';
import { setListOfLessonLabs } from './lessonLabSlice';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ScienceIcon from '@mui/icons-material/Science';
import ConstructionIcon from '@mui/icons-material/Construction';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import { setSnackbarMessage } from '../../pages/appSlice';
import DevicePlanning from './DevicePlanning';
import InstrumentPlanning from './InstrumentPlanning';
import ChemicalPlanning from './ChemicalPlanning';
import Autocomplete from '@mui/material/Autocomplete';

const LessonLabTable: FC = () => {
  const lessonLabData = useAppSelector((state: RootState) => state.lessonLab.listOfLessonLabs);
  const subjectData = useAppSelector((state: RootState) => state.subject.listOfSubjects);

  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [isDevicePlanningModal, setIsDevicePlanningModal] = useState<boolean>(false);
  const [isChemicalPlanningModal, setIsChemicalPlanningModal] = useState<boolean>(false);
  const [isInstrumentPlanningModal, setIsInstrumentPlanningModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ILessonLabType[]>([]);
  const [subjectDataValue, setSubjectDataValue] = useState<any>([]);
  const [listOfLessons, setListOfLessons] = useState<string[]>([]);
  const [defaultDevicePlanning, setDefaultDevicePlanning] = useState<IDevicesBelongingToLessonLab[]>([]);
  const [defaultInstrumentPlanning, setDefaultInstrumentPlanning] = useState<IDevicesBelongingToLessonLab[]>([]);
  const [defaultChemicalPlanning, setDefaultChemicalPlanning] = useState<IChemicalsBelongingToLessonLabType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyLessonLabData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyLessonLabData);
  const [createdRow, setCreatedRow] = useState<any>(dummyLessonLabData);
  const [selectedRow, setSelectedRow] = useState<any>(dummyLessonLabData);

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
    let formatedLessonLabData = lessonLabData.length > 0 ? lessonLabData.map((x: ILessonLabType) => {
      let SubjectInfoIdx = subjectData.findIndex(y => y.SubjectId === x.SubjectId);
      return {
        ...x,
        "SubjectName": SubjectInfoIdx > -1 ? subjectData[SubjectInfoIdx].SubjectName : ""
      }
    }) : [];
    setTableData(formatedLessonLabData);
  }, [lessonLabData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<ILessonLabType>,
    ): MRT_ColumnDef<ILessonLabType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<ILessonLabType>[]>(
    () => [
      {
        accessorKey: 'SubjectName',
        header: 'Tên môn học',
        size: 140,
      },
      {
        accessorKey: 'LessonName',
        header: 'Tên bài thí nghiệm',
        size: 100,
      }
    ],
    [getCommonEditTextFieldProps],
  );

  const handleOpenEditModal = (row: any) => {
    setUpdatedRow(row.original);
    setIsEditModal(true);
  }

  const onCloseEditModal = () => {
    setUpdatedRow(dummyLessonLabData);
    setIsEditModal(false);
  }

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updateLessonLab({
      "LessonId": updatedRow.LessonId,
      "LessonName": updatedRow.LessonName,
      "SubjectId": updatedRow.SubjectId,
      "listChemical": updatedRow.listChemical,
      "listDevice": updatedRow.listDevice,
      "listInstrument": updatedRow.listInstrument
    });
    if (isUpdatedSuccess) {
      dispatch(setSnackbarMessage("Cập nhật thông tin bài thí nghiệm thành công"));
      let updatedIdx = lessonLabData.findIndex(x => x.LessonId === updatedRow.LessonId);
      let newListOfLessonLabs = [...lessonLabData.slice(0, updatedIdx), updatedRow, ...lessonLabData.slice(updatedIdx + 1,)]
      dispatch(setListOfLessonLabs(newListOfLessonLabs));
    }

    onCloseEditModal();
  }

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    setDeletedRow(dummyLessonLabData);
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deleteLessonLab(deletedRow.LessonId);
    dispatch(setSnackbarMessage("Xóa thông tin bài thí nghiệm thành công"));
    let deletedIdx = lessonLabData.findIndex((x: ILessonLabType) => x.LessonId === deletedRow.LessonId);
    let newListOfLessonLabs = [...lessonLabData.slice(0, deletedIdx), ...lessonLabData.slice(deletedIdx + 1,)]
    dispatch(setListOfLessonLabs(newListOfLessonLabs));

    onCloseDeleteModal();
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setCreatedRow(dummyLessonLabData);
    setListOfLessons([]);
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    let promisesList: any[] = [];
    if (listOfLessons.length === 0) {
      dispatch(setSnackbarMessage("Vui lòng thêm ít nhất tên một bài thí nghiệm"));
    }
    else {
      listOfLessons.forEach(item => promisesList.push(postLessonLab({
        "LessonName": item,
        "SubjectId": createdRow.SubjectId,
        "listChemical": [],
        "listDevice": [],
        "listInstrument": []
      })));

      Promise.all(promisesList).then(async () => {
        const newListOfLessonLabs: ILessonLabType[] = await getLessonLabs();
        if (newListOfLessonLabs) {
          dispatch(setSnackbarMessage("Tạo thông tin bài thí nghiệm mới thành công"));
          dispatch(setListOfLessonLabs(newListOfLessonLabs));
        }
        onCloseCreateModal();
      }).catch(() => {
        dispatch(setSnackbarMessage("Tạo thông tin bài thí nghiệm mới thất bại"));
        throw new Error();
      });
    }
  }

  const handleOpenDevicePlanningModal = async (row: any) => {
    setSelectedRow(row.original);

    let devicePlanningData = lessonLabData.find((item: ILessonLabType) => item.LessonId === row.original.LessonId)
    if (devicePlanningData) {
      setDefaultDevicePlanning(devicePlanningData.listDevice);
      setIsDevicePlanningModal(true);
    }
  }

  const onCloseDevicePlanningModal = () => {
    setSelectedRow(dummyLessonLabData);
    setIsDevicePlanningModal(false);
  }

  const onHandleSubmitDevicePlanningModal = async (DevicePlanningData: IDevicesBelongingToLessonLab[]) => {
    let updatedData = {
      ...selectedRow,
      listDevice: DevicePlanningData
    }

    await updateLessonLab(updatedData);
    let updatedIdx = lessonLabData.findIndex((x: ILessonLabType) => x.LessonId === updatedData.LessonId);
    let updatedLessonLabData = [...lessonLabData.slice(0, updatedIdx), updatedData, ...lessonLabData.slice(updatedIdx + 1,)];
    dispatch(setListOfLessonLabs(updatedLessonLabData));
    dispatch(setSnackbarMessage("Cập nhật dự trù thiết bị thành công"));
    onCloseDevicePlanningModal();
  }

  const handleOpenChemicalPlanningModal = async (row: any) => {
    setSelectedRow(row.original);

    let devicePlanningData = lessonLabData.find((item: ILessonLabType) => item.LessonId === row.original.LessonId)
    if (devicePlanningData) {
      setDefaultChemicalPlanning([...devicePlanningData.listChemical]);
      setIsChemicalPlanningModal(true);
    }
  }

  const onCloseChemicalPlanningModal = () => {
    setSelectedRow(dummyLessonLabData);
    setIsChemicalPlanningModal(false);
  }

  const onHandleSubmitChemicalPlanningModal = async (ChemicalPlanningData: IChemicalsBelongingToLessonLabType[]) => {
    let updatedData = {
      ...selectedRow,
      listChemical: ChemicalPlanningData
    }

    await updateLessonLab(updatedData);
    let updatedIdx = lessonLabData.findIndex((x: ILessonLabType) => x.LessonId === updatedData.LessonId);
    let updatedLessonLabData = [...lessonLabData.slice(0, updatedIdx), updatedData, ...lessonLabData.slice(updatedIdx + 1,)];
    dispatch(setListOfLessonLabs(updatedLessonLabData));
    dispatch(setSnackbarMessage("Cập nhật dự trù hoá chất thành công"));
    onCloseChemicalPlanningModal();
  }

  const handleOpenInstrumentPlanningModal = async (row: any) => {
    setSelectedRow(row.original);

    let devicePlanningData = lessonLabData.find((item: ILessonLabType) => item.LessonId === row.original.LessonId)
    if (devicePlanningData) {
      setDefaultInstrumentPlanning(devicePlanningData.listInstrument);
      setIsInstrumentPlanningModal(true);
    }
  }

  const onCloseInstrumentPlanningModal = () => {
    setSelectedRow(dummyLessonLabData);
    setIsInstrumentPlanningModal(false);
  }

  const onHandleSubmitInstrumentPlanningModal = async (InstrumentPlanningData: IDevicesBelongingToLessonLab[]) => {
    let updatedData = {
      ...selectedRow,
      listInstrument: InstrumentPlanningData
    }

    await updateLessonLab(updatedData);
    let updatedIdx = lessonLabData.findIndex((x: ILessonLabType) => x.LessonId === updatedData.LessonId);
    let updatedLessonLabData = [...lessonLabData.slice(0, updatedIdx), updatedData, ...lessonLabData.slice(updatedIdx + 1,)];
    dispatch(setListOfLessonLabs(updatedLessonLabData));
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
            <Tooltip arrow placement="left" title="Sửa thông tin bài thí nghiệm">
              <IconButton style={{ "paddingRight": "0px" }} onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Xoá thông tin bài thí nghiệm">
              <IconButton style={{ "paddingLeft": "0px", "paddingRight": "0px" }} color="error" onClick={() => handleOpenDeleteModal(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Dự trù hoá chất cho bài thí nghiệm">
              <IconButton style={{ "paddingLeft": "0px", "paddingRight": "0px" }} color="secondary" onClick={() => handleOpenChemicalPlanningModal(row)}>
                <ScienceIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Dự trù thiết bị cho bài thí nghiệm">
              <IconButton style={{ "paddingLeft": "0px" }} color="info" onClick={() => handleOpenDevicePlanningModal(row)}>
                <ConstructionIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Dự trù dụng cụ cho bài thí nghiệm">
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
            <span>Thông tin bài thí nghiệm</span>
          </h3>
        )}
        renderBottomToolbarCustomActions={() => (
          <Tooltip title="Tạo bài thí nghiệm mới" placement="right-start">
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
        <DialogTitle textAlign="center"><b>Sửa thông tin bài thí nghiệm</b></DialogTitle>
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
                if (column.accessorKey === "SubjectName" && subjectData.length > 0) {
                  return (
                    <Autocomplete
                      key={"SubjectName"}
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
              }
              )}
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
        <DialogTitle textAlign="center"><b>Xoá thông tin bài thí nghiệm</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin bài thí nghiệm {`${deletedRow.LessonName}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
        <DialogTitle textAlign="center"><b>Tạo thông tin bài thí nghiệm</b></DialogTitle>
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
                if (column.accessorKey === "SubjectName" && subjectData.length > 0) {
                  return (
                    <Autocomplete
                      key={"SubjectName"}
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
                else {
                  return <div className="addNewLessonsDiv" style={{ "display": "flex" }}>
                    <TextField
                      style={{ "width": "80%" }}
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      defaultValue={column.id && createdRow[column.id]}
                      onChange={(e) =>
                        setCreatedRow({ ...createdRow, [e.target.name]: e.target.value })
                      }
                    />
                    <Tooltip title="Thêm bài thí nghiệm mới" placement="right-start">
                      <Button
                        color="primary"
                        onClick={() => {
                          setListOfLessons([...listOfLessons, createdRow.LessonName.toString()])
                        }}
                        variant="contained"
                        style={{ "margin": "10px" }}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                  </div>
                }
              }
              )}
              <Box
                key={"lessonLabBox"}
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              >
                {listOfLessons.length > 0 && <Typography variant="h6" component="div">
                  <b> Danh sách các bài của môn:</b>
                </Typography>}
                <List dense={true}>
                  {listOfLessons.map((item, lessonIdx) =>
                    <ListItem
                      key={"lesson" + item + lessonIdx}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => {
                          let temp = [...listOfLessons];
                          temp.splice(temp.indexOf(item), 1);
                          setListOfLessons(temp);
                        }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={item}
                      />
                    </ListItem>)
                  }
                </List>
              </Box>
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

      <DevicePlanning
        isOpen={isDevicePlanningModal}
        currentLessonLab={selectedRow}
        onClose={onCloseDevicePlanningModal}
        handleSubmit={onHandleSubmitDevicePlanningModal}
        defaultCurrentValue={defaultDevicePlanning}
      />

      <InstrumentPlanning
        isOpen={isInstrumentPlanningModal}
        currentLessonLab={selectedRow}
        onClose={onCloseInstrumentPlanningModal}
        handleSubmit={onHandleSubmitInstrumentPlanningModal}
        defaultCurrentValue={defaultInstrumentPlanning}
      />

      <ChemicalPlanning
        isOpen={isChemicalPlanningModal}
        currentLessonLab={selectedRow}
        onClose={onCloseChemicalPlanningModal}
        handleSubmit={onHandleSubmitChemicalPlanningModal}
        defaultCurrentValue={defaultChemicalPlanning}
      />
    </>
  );
};

export default LessonLabTable;
