import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from "material-react-table";
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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  dummyResearcherData,
  IResearcherType,
} from "../../types/researchTeamType";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  deleteResearcher,
  getResearchers,
  postResearcher,
  updateResearcher,
} from "../../services/researchTeamServices";
import { RootState } from "../../store";
import { setListOfResearchers } from "./researchTeamSlice";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setSnackbarMessage } from "../../pages/appSlice";
import { Genders } from "../../configs/enums";

const ResearchersTable: FC = () => {
  const researchersData = useAppSelector(
    (state: RootState) => state.researchTeam.listOfResearchers
  );
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IResearcherType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyResearcherData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyResearcherData);
  const [createdRow, setCreatedRow] = useState<any>(dummyResearcherData);

  useEffect(() => {
    let formatedResearcherData =
      researchersData.length > 0
        ? researchersData.map((researcher: IResearcherType) => {
            return {
              ...researcher,
              formatedBirthdate: moment
                .unix(Number(researcher.Birthdate))
                .format("DD/MM/YYYY"),
            };
          })
        : [];
    setTableData(formatedResearcherData);
  }, [researchersData]);

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IResearcherType>
    ): MRT_ColumnDef<IResearcherType>["muiTableBodyCellEditTextFieldProps"] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors]
  );

  const columns = useMemo<MRT_ColumnDef<IResearcherType>[]>(
    () => [
      {
        accessorKey: "ResearcherId",
        header: "Mã nhà nghiên cứu",
      },
      {
        accessorKey: "Fullname",
        header: "Tên nhà nghiên cứu",
      },
      {
        accessorKey: "formatedBirthdate",
        header: "Ngày sinh",
      },
      {
        accessorKey: "Email",
        header: "Email",
      },
      {
        accessorKey: "Gender",
        header: "Giới tính",
      },
      {
        accessorKey: "PhoneNumber",
        header: "SĐT",
      },
      {
        accessorKey: "Organization",
        header: "Cơ quan",
      },
    ],
    [getCommonEditTextFieldProps]
  );

  const handleOpenEditModal = (row: any) => {
    setUpdatedRow(row.original);
    setIsEditModal(true);
  };

  const onCloseEditModal = () => {
    setUpdatedRow(dummyResearcherData);
    setIsEditModal(false);
  };

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updateResearcher(updatedRow);
    if (isUpdatedSuccess) {
      dispatch(
        setSnackbarMessage("Cập nhật thông tin nhà nghiên cứu thành công")
      );
      let updatedIdx = researchersData.findIndex(
        (x) => x.ResearcherId === updatedRow.ResearcherId
      );
      let newListOfResearchers = [
        ...researchersData.slice(0, updatedIdx),
        updatedRow,
        ...researchersData.slice(updatedIdx + 1),
      ];
      dispatch(setListOfResearchers(newListOfResearchers));
    }

    onCloseEditModal();
  };

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  };

  const onCloseDeleteModal = () => {
    setDeletedRow(dummyResearcherData);
    setIsDeleteModal(false);
  };

  const handleSubmitDeleteModal = async () => {
    await deleteResearcher(deletedRow.ResearcherId);
    dispatch(setSnackbarMessage("Xóa thông tin nhà nghiên cứu thành công"));
    let deletedIdx = researchersData.findIndex(
      (x) => x.ResearcherId === deletedRow.ResearcherId
    );
    let newListOfResearchers = [
      ...researchersData.slice(0, deletedIdx),
      ...researchersData.slice(deletedIdx + 1),
    ];
    dispatch(setListOfResearchers(newListOfResearchers));

    onCloseDeleteModal();
  };

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  };

  const onCloseCreateModal = () => {
    setCreatedRow(dummyResearcherData);
    setIsCreateModal(false);
  };

  const handleSubmitCreateModal = async () => {
    const createdResearcher = await postResearcher({
      ResearcherId: createdRow.ResearcherId,
      Fullname: createdRow.Fullname,
      Birthdate: createdRow.Birthdate,
      Gender: createdRow.Gender,
      Email: createdRow.Email,
      PhoneNumber: createdRow.PhoneNumber,
      Address: createdRow.Address,
      Organization: createdRow.Organization,
      GroupId: createdRow.GroupId,
      GroupName: createdRow.GroupName,
      Status: createdRow.Status,
    });
    if (createdResearcher) {
      const newListOfResearchers: IResearcherType[] = await getResearchers();
      if (newListOfResearchers) {
        dispatch(
          setSnackbarMessage("Tạo thông tin nhà nghiên cứu mới thành công")
        );
        dispatch(setListOfResearchers(newListOfResearchers));
      }
    }
    onCloseCreateModal();
  };

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "Các hành động",
            muiTableHeadCellProps: {
              align: "center",
            },
            muiTableBodyCellProps: {
              align: "center",
            },
          },
          "mrt-row-numbers": {
            muiTableHeadCellProps: {
              align: "center",
            },
            muiTableBodyCellProps: {
              align: "center",
            },
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
          density: "compact",
          columnOrder: [
            "mrt-row-numbers",
            ...columns.map((x) => x.accessorKey || ""),
            "mrt-row-actions",
          ],
        }}
        renderRowActions={({ row, table }) => (
          <>
            <Tooltip
              arrow
              placement="left"
              title="Sửa thông tin nhà nghiên cứu"
            >
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip
              arrow
              placement="right"
              title="Xoá thông tin nhà nghiên cứu"
            >
              <IconButton
                color="error"
                onClick={() => handleOpenDeleteModal(row)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        )}
        renderTopToolbarCustomActions={() => (
          <h3 style={{ margin: "0px" }}>
            <b>
              <KeyboardArrowRightIcon
                style={{ margin: "0px", fontSize: "30px", paddingTop: "15px" }}
              ></KeyboardArrowRightIcon>
            </b>
            <span>Quản lý nhà nghiên cứu</span>
          </h3>
        )}
        renderBottomToolbarCustomActions={() => (
          <Tooltip title="Tạo nhà nghiên cứu mới" placement="right-start">
            <Button
              color="primary"
              onClick={handleOpenCreateModal}
              variant="contained"
              style={{ margin: "10px" }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Tooltip>
        )}
      />

      <Dialog open={isEditModal}>
        <DialogTitle textAlign="center">
          <b>Sửa thông tin nhà nghiên cứu</b>
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ marginTop: "10px" }}
          >
            <Stack
              sx={{
                width: "100%",
                minWidth: { xs: "300px", sm: "360px", md: "400px" },
                gap: "1.5rem",
              }}
            >
              {columns.map((column) => {
                if (column.accessorKey === "ResearcherId") {
                  return (
                    <TextField
                      disabled
                      key="ResearcherId"
                      label="ResearcherId"
                      name="ResearcherId"
                      defaultValue={updatedRow["ResearcherId"]}
                    />
                  );
                } else if (column.accessorKey === "formatedBirthdate") {
                  return (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        key={"UpdateBirthdate"}
                        label="Ngày sinh"
                        value={new Date(updatedRow.Birthdate * 1000)}
                        onChange={(val: any) =>
                          setUpdatedRow({
                            ...updatedRow,
                            formatedBirthdate: moment
                              .unix(Date.parse(val) / 1000)
                              .format("DD/MM/YYYY"),
                            Birthdate: Date.parse(val) / 1000,
                          })
                        }
                        renderInput={(params: any) => (
                          <TextField
                            key={"UpdateBirthdateTextField"}
                            {...params}
                          />
                        )}
                        inputFormat="DD/MM/YYYY"
                      />
                    </LocalizationProvider>
                  );
                } else if (column.accessorKey === "Gender") {
                  return (
                    <FormControl sx={{ m: 0, minWidth: 120 }}>
                      <InputLabel id="edit-select-required">
                        Giới tính
                      </InputLabel>
                      <Select
                        labelId="edit-select-required"
                        id="edit-select-required"
                        value={Genders[updatedRow.Gender]}
                        label="Giới tính"
                        onChange={(e: SelectChangeEvent) =>
                          setUpdatedRow({
                            ...updatedRow,
                            Gender: Genders[Number(e.target.value)],
                          })
                        }
                      >
                        {Object.values(Genders)
                          .slice(0, (Object.values(Genders).length + 1) / 2)
                          .map((x, idx) => (
                            <MenuItem key={"UpdateGender" + idx} value={idx}>
                              {x}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  );
                } else {
                  return (
                    <TextField
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      defaultValue={column.id && updatedRow[column.id]}
                      onChange={(e) =>
                        setUpdatedRow({
                          ...updatedRow,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  );
                }
              })}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={onCloseEditModal}>Hủy</Button>
          <Button
            color="primary"
            onClick={handleSubmitEditModal}
            variant="contained"
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteModal}>
        <DialogTitle textAlign="center">
          <b>Xoá thông tin nhà nghiên cứu</b>
        </DialogTitle>
        <DialogContent>
          <div>
            Bạn có chắc muốn xoá thông tin nhà nghiên cứu{" "}
            {`${deletedRow.ResearcherId}`} không?
          </div>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={onCloseDeleteModal}>Hủy</Button>
          <Button
            color="primary"
            onClick={handleSubmitDeleteModal}
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
        <DialogTitle textAlign="center">
          <b>Tạo thông tin nhà nghiên cứu</b>
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ marginTop: "10px" }}
          >
            <Stack
              sx={{
                width: "100%",
                minWidth: { xs: "300px", sm: "360px", md: "400px" },
                gap: "1.5rem",
              }}
            >
              {columns.map((column) => {
                if (column.accessorKey === "formatedBirthdate") {
                  return (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        key={"CreateBirthdate"}
                        label="Ngày sinh"
                        value={new Date(createdRow.Birthdate * 1000)}
                        onChange={(val: any) =>
                          setCreatedRow({
                            ...createdRow,
                            formatedBirthdate: moment
                              .unix(Date.parse(val) / 1000)
                              .format("DD/MM/YYYY"),
                            Birthdate: Date.parse(val) / 1000,
                          })
                        }
                        renderInput={(params: any) => (
                          <TextField
                            key={"CreateBirthdateTextField"}
                            {...params}
                          />
                        )}
                        inputFormat="DD/MM/YYYY"
                      />
                    </LocalizationProvider>
                  );
                } else if (column.accessorKey === "Gender") {
                  return (
                    <FormControl sx={{ m: 0, minWidth: 120 }}>
                      <InputLabel id="edit-select-required">
                        Giới tính
                      </InputLabel>
                      <Select
                        labelId="edit-select-required"
                        id="edit-select-required"
                        value={Genders[createdRow.Gender]}
                        label="Giới tính"
                        onChange={(e: SelectChangeEvent) =>
                          setCreatedRow({
                            ...createdRow,
                            Gender: Genders[Number(e.target.value)],
                          })
                        }
                      >
                        {Object.values(Genders)
                          .slice(0, (Object.values(Genders).length + 1) / 2)
                          .map((x, idx) => (
                            <MenuItem key={"CreateGender" + idx} value={idx}>
                              {x}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  );
                } else {
                  return (
                    <TextField
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      defaultValue={column.id && createdRow[column.id]}
                      onChange={(e) =>
                        setCreatedRow({
                          ...createdRow,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  );
                }
              })}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={onCloseCreateModal}>Hủy</Button>
          <Button
            color="primary"
            onClick={handleSubmitCreateModal}
            variant="contained"
          >
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResearchersTable;
