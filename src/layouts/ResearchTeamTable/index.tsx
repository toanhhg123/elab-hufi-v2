import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  IconButton,
  Stack,
  TextareaAutosize,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { dummyResearchTeamData, IResearchTeamType } from '../../types/researchTeamType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  deleteResearchTeam,
  getResearchTeams,
  postResearchTeam,
  updateResearchTeam
} from '../../services/researchTeamServices';
import { RootState } from '../../store';
import { setListOfResearchTeams } from './researchTeamSlice';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { setSnackbarMessage } from '../../pages/appSlice';
import { ColumnType } from './Utils';
import ResearchTeamChemicalTable from './TeamMemberTable';
import AddNewMemberTable from './AddNewMemberTable';

const ResearchTeamTable: FC = () => {
  const researchTeamsData = useAppSelector((state: RootState) => state.researchTeam.listOfResearchTeams);
  const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IResearchTeamType[]>([]);
  const [employeeDataValue, setEmployeeDataValue] = useState<any>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyResearchTeamData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyResearchTeamData);
  const [createdRow, setCreatedRow] = useState<any>(dummyResearchTeamData);

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
    if (researchTeamsData.length > 0) {
      setTableData(researchTeamsData);
    }

  }, [researchTeamsData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IResearchTeamType>,
    ): MRT_ColumnDef<IResearchTeamType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IResearchTeamType>[]>(
    () => [
      {
        accessorKey: 'TeamId',
        header: 'Mã nhóm nghiên cứu',
      },
      {
        accessorKey: 'TeamName',
        header: 'Tên nhóm nghiên cứu',
      },
      {
        accessorKey: 'Note',
        header: 'Ghi chú',
      },
    ],
    [getCommonEditTextFieldProps],
  );

  const TeamMemberTableColumns = useRef<ColumnType[]>([
    {
      id: 'Title',
      header: 'Chức vụ',
    },
    {
      id: 'ResearcherId',
      header: 'Mã nghiên cứu viên',
    },
    {
      id: 'Fullname',
      header: 'Họ và tên',
    },
    {
      id: 'Birthday',
      header: 'Ngày sinh',
      type: 'date'
    },
    {
      id: 'Gender',
      header: 'Giới tính',
    },
    {
      id: 'Address',
      header: 'Địa chỉ',
    },
    {
      id: 'Email',
      header: 'Email',
    },
    {
      id: 'PhoneNumber',
      header: 'SĐT',
    },
    {
      id: 'Organization',
      header: 'Tổ chức',
    },
  ]);

  const handleOpenEditModal = (row: any) => {
    setUpdatedRow(row.original);
    setIsEditModal(true);
  }

  const onCloseEditModal = () => {
    setUpdatedRow(dummyResearchTeamData);
    setIsEditModal(false);
  }

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updateResearchTeam(updatedRow);
    if (isUpdatedSuccess) {
      dispatch(setSnackbarMessage("Cập nhật thông tin nhóm nghiên cứu thành công"));
      let updatedIdx = researchTeamsData.findIndex(x => x.TeamId === updatedRow.TeamId);
      let newListOfResearchTeams = [...researchTeamsData.slice(0, updatedIdx), updatedRow, ...researchTeamsData.slice(updatedIdx + 1,)]
      dispatch(setListOfResearchTeams(newListOfResearchTeams));
    }

    onCloseEditModal();
  }

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    setDeletedRow(dummyResearchTeamData);
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deleteResearchTeam(deletedRow.TeamId);
    dispatch(setSnackbarMessage("Xóa thông tin nhóm nghiên cứu thành công"));
    let deletedIdx = researchTeamsData.findIndex(x => x.TeamId === deletedRow.TeamId);
    let newListOfResearchTeams = [...researchTeamsData.slice(0, deletedIdx), ...researchTeamsData.slice(deletedIdx + 1,)]
    dispatch(setListOfResearchTeams(newListOfResearchTeams));

    onCloseDeleteModal();
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setCreatedRow(dummyResearchTeamData);
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdResearchTeam = await postResearchTeam(createdRow);
    if (createdResearchTeam.TeamId) {
      const newListOfResearchTeams: IResearchTeamType[] = await getResearchTeams();
      if (newListOfResearchTeams) {
        dispatch(setSnackbarMessage("Tạo thông tin nhóm nghiên cứu mới thành công"));
        dispatch(setListOfResearchTeams(newListOfResearchTeams));
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
            'mrt-row-expand',
            'mrt-row-numbers',
            ...columns.map(x => x.accessorKey || ''),
            'mrt-row-actions'
          ]
        }}
        renderDetailPanel={({ row }) => (
          <>
            {row.original.listMember.length > 0 &&
              <ResearchTeamChemicalTable
                chemicalData={row.original.listMember}
                columns={TeamMemberTableColumns.current}
              />}
          </>
        )}
        renderRowActions={({ row, table }) => (
          <>
            <Tooltip arrow placement="left" title="Sửa thông tin nhóm nghiên cứu">
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá thông tin nhóm nghiên cứu">
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
            <span>Thông tin nhóm nghiên cứu</span>
          </h3>
        )}
        renderBottomToolbarCustomActions={() => (
          <Tooltip title="Tạo nhóm nghiên cứu mới" placement="right-start">
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

      <Dialog
        open={isEditModal}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "800px",  // Set your width here
            },
          },
        }}
      >
        <DialogTitle textAlign="center"><b>Sửa thông tin nhóm nghiên cứu</b></DialogTitle>
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
                if (column.accessorKey === "Note") {
                  return <TextareaAutosize
                    key={"EditNote"}
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="Nhập ghi chú..."
                    defaultValue={updatedRow["Note"]}
                    onChange={(e) =>
                      setUpdatedRow({ ...updatedRow, "Note": e.target.value })
                    }
                  />
                }
                else if (column.accessorKey === 'TeamId') {
                  return <TextField
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={column.accessorKey && updatedRow[column.accessorKey]}
                    disabled
                  />
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
              <AddNewMemberTable
                currentResearchTeam={updatedRow}
                setCurrentResearchTeam={setUpdatedRow}
                setIsResearchTeamDialog={setIsEditModal}
              />
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
        <DialogTitle textAlign="center"><b>Xoá thông tin nhóm nghiên cứu</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin nhóm nghiên cứu {`${deletedRow.TeamId}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isCreateModal}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "800px",  // Set your width here
            },
          },
        }}
      >
        <DialogTitle textAlign="center"><b>Tạo thông tin nhóm nghiên cứu</b></DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              {columns.slice(1,).map((column) => {
                if (column.accessorKey === "Note") {
                  return <TextareaAutosize
                    key={"CreateNote"}
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="Nhập ghi chú..."
                    defaultValue={createdRow["Note"]}
                    onChange={(e) =>
                      setCreatedRow({ ...createdRow, "Note": e.target.value })
                    } />
                }
                else {
                  return <TextField
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={column.id && updatedRow[column.id]}
                    onChange={(e) =>
                      setCreatedRow({ ...createdRow, [e.target.name]: e.target.value })
                    }
                  />
                }
              }
              )}
              <AddNewMemberTable
                currentResearchTeam={createdRow}
                setCurrentResearchTeam={setCreatedRow}
                setIsResearchTeamDialog={setIsCreateModal}
              />

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

export default React.memo(ResearchTeamTable);
