import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from "material-react-table";
import {
  TextareaAutosize,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Autocomplete,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  dummyPlanSubjectData,
  IPlanSubjectType,
} from "../../types/planSubjectType";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  deletePlanSubject,
  getPlanningSuggestion,
  getPlanSubjects,
  postPlanSubject,
  updatePlanSubject,
} from "../../services/planSubjectServices";
import { RootState } from "../../store";
import { setListOfPlanSubjects } from "./planSubjectSlice";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setSnackbarMessage } from "../../pages/appSlice";
import DetailDeviceTable from "./Details/DetailDeviceTable";
import { ColumnType } from "./Utils";
import DetailInstrumentTable from "./Details/DetailInstrumentTable";
import DetailChemicalTable from "./Details/DetailChemicalTable";
import ChemicalPlanning from "./Planning/ChemicalPlanning";
import DevicePlanning from "./Planning/DevicePlanning";
import InstrumentPlanning from "./Planning/InstrumentPlanning";
import SummaryTable from "./Details/SummaryTable";

const semesterValue = ["1", "2", "3"];
const schoolYearValue = ["2020-2021", "2021-2022", "2022-2023"];

type SuggestionProps = {
  Semester: string;
  Schoolyear: string;
  SubjectId: string;
  SubjectName?: string;
};

const dummyPlanSubjectSuggestion: SuggestionProps = {
  Semester: "1",
  Schoolyear: "2022-2023",
  SubjectId: "",
  SubjectName: "",
};

const PlanSubjectTable: FC = () => {
  const planSubjectsData = useAppSelector(
    (state: RootState) => state.planSubject.listOfPlanSubjects
  );
  const employeeData = useAppSelector(
    (state: RootState) => state.employee.listOfEmployees
  );
  const subjectData = useAppSelector(
    (state: RootState) => state.subject.listOfSubjects
  );
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IPlanSubjectType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyPlanSubjectData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyPlanSubjectData);
  const [createdRow, setCreatedRow] = useState<any>(dummyPlanSubjectData);
  const [subjectDataValue, setSubjectDataValue] = useState<any>([]);
  const [employeeDataValue, setEmployeeDataValue] = useState<any>([]);
  const [suggestedPlanning, setSuggestedPlanning] = useState<SuggestionProps>(
    dummyPlanSubjectSuggestion
  );
  const [isSummaryModal, setIsSummaryModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (subjectData.length > 0) {
      const list = subjectData.map((x) => ({
        label: `${x.SubjectId} - ${x.SubjectName}`,
        id: x.SubjectId,
        name: x.SubjectName,
      }));
      setSubjectDataValue(list);
    }
  }, [subjectData]);

  useEffect(() => {
    if (employeeData.length > 0) {
      const list = employeeData.map((x) => ({
        label: `${x.EmployeeId} - ${x.Fullname}`,
        id: x.EmployeeId,
        name: x.Fullname,
      }));
      setEmployeeDataValue(list);
    }
  }, [employeeData]);

  useEffect(() => {
    if (planSubjectsData.length > 0) {
      let formatedPlanSubjectsData = planSubjectsData.map((emp) => {
        let employeeInfoIdx = employeeData.findIndex(
          (y) => y.EmployeeId === emp.EmployeeId
        );

        let subjectInfoIdx =
          subjectData?.findIndex((y) => y.SubjectId === emp.SubjectId) ?? -1;

        return {
          ...emp,
          EmployeeName:
            employeeInfoIdx > -1
              ? employeeData[employeeInfoIdx].Fullname.toString()
              : "",
          SubjectName:
            subjectInfoIdx > -1
              ? subjectData[subjectInfoIdx].SubjectName.toString()
              : "",
        };
      });
      setTableData(formatedPlanSubjectsData);
    }
  }, [planSubjectsData]);

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IPlanSubjectType>
    ): MRT_ColumnDef<IPlanSubjectType>["muiTableBodyCellEditTextFieldProps"] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors]
  );

  const columns = useMemo<MRT_ColumnDef<IPlanSubjectType>[]>(
    () => [
      {
        accessorKey: "PlanId",
        header: "Mã phiếu",
      },
      {
        accessorKey: "Semester",
        header: "Học kỳ",
      },
      {
        accessorKey: "Schoolyear",
        header: "Năm học",
      },
      {
        accessorKey: "Content",
        header: "Nội dung",
      },
      {
        accessorKey: "NumClass",
        header: "SL lớp",
      },
      {
        accessorKey: "NumGroupOfClass",
        header: "SL nhóm",
      },
      {
        accessorKey: "SubjectName",
        header: "Môn học",
      },
      {
        accessorKey: "EmployeeName",
        header: "Người lập",
      },
      {
        accessorKey: "Note",
        header: "Ghi chú",
      },
    ],
    [getCommonEditTextFieldProps]
  );

  const infoInSuggestedPlanning = [
    {
      id: "PlanId",
      name: "Mã phiếu",
    },
    {
      id: "Content",
      name: "Nội dung",
    },
  ];

  const chemicalInPlanSubjectTableColumns = useRef<ColumnType[]>([
    {
      id: "ChemicalId",
      header: "Mã HC",
    },
    {
      id: "ChemicalName",
      header: "Tên HC",
    },
    {
      id: "Specifications",
      header: "Công thức",
    },
    {
      id: "Amount",
      header: "Số lượng chuẩn/1 nhóm lớp",
      renderValue: (Quantity, Unit) => `${Quantity} (${Unit})`,
    },
    {
      id: "AmountTotal",
      header: "Số lượng tổng/Học kỳ",
      renderValue: (Quantity, Unit) => `${Quantity} (${Unit})`,
    },
    {
      id: "Note",
      header: "Ghi chú",
    },
  ]);

  const deviceInPlanSubjectTableColumns = useRef<ColumnType[]>([
    {
      id: "DeviceId",
      header: "Mã TB",
    },
    {
      id: "DeviceName",
      header: "Tên TB",
    },
    {
      id: "Standard",
      header: "Quy cách",
    },
    {
      id: "Quantity",
      header: "Số lượng",
      renderValue: (Quantity, Unit) => `${Quantity} (${Unit})`,
    },
    {
      id: "Note",
      header: "Ghi chú",
    },
  ]);

  const instrumentInPlanSubjectTableColumns = useRef<ColumnType[]>([
    {
      id: "DeviceId",
      header: "Mã DC",
    },
    {
      id: "DeviceName",
      header: "Tên DC",
    },
    {
      id: "Standard",
      header: "Quy cách",
    },
    {
      id: "Quantity",
      header: "Số lượng",
      renderValue: (Quantity, Unit) => `${Quantity} (${Unit})`,
    },
    {
      id: "Note",
      header: "Ghi chú",
    },
  ]);

  const handleOpenEditModal = (row: any) => {
    setUpdatedRow(row.original);
    setIsEditModal(true);
  };

  const onCloseEditModal = () => {
    setUpdatedRow(dummyPlanSubjectData);
    setIsEditModal(false);
  };

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updatePlanSubject({
      PlanId: updatedRow.PlanId,
      Semester: updatedRow.Semester,
      Schoolyear: updatedRow.Schoolyear,
      Content: updatedRow.Content,
      NumClass: updatedRow.NumClass,
      NumGroupOfClass: updatedRow.NumGroupOfClass,
      Note: updatedRow.Note,
      EmployeeId: updatedRow.EmployeeId,
      SubjectId: updatedRow.SubjectId,
      listChemical: updatedRow.listChemical,
      listDevice: updatedRow.listDevice,
      listInstrument: updatedRow.listInstrument,
    });

    if (isUpdatedSuccess) {
      dispatch(
        setSnackbarMessage("Cập nhật thông tin phiếu dự trù thành công")
      );
      let updatedIdx = planSubjectsData.findIndex(
        (x) => x.PlanId === updatedRow.PlanId
      );
      let newListOfPlanSubjects = [
        ...planSubjectsData.slice(0, updatedIdx),
        updatedRow,
        ...planSubjectsData.slice(updatedIdx + 1),
      ];
      dispatch(setListOfPlanSubjects(newListOfPlanSubjects));
    }

    onCloseEditModal();
  };

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  };

  const onCloseDeleteModal = () => {
    setDeletedRow(dummyPlanSubjectData);
    setIsDeleteModal(false);
  };

  const handleSubmitDeleteModal = async () => {
    await deletePlanSubject(deletedRow.PlanId);
    dispatch(setSnackbarMessage("Xóa phiếu dự trù thành công"));
    let deletedIdx = planSubjectsData.findIndex(
      (x) => x.PlanId === deletedRow.PlanId
    );
    let newListOfPlanSubjects = [
      ...planSubjectsData.slice(0, deletedIdx),
      ...planSubjectsData.slice(deletedIdx + 1),
    ];
    dispatch(setListOfPlanSubjects(newListOfPlanSubjects));

    onCloseDeleteModal();
  };

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  };

  const onCloseCreateModal = () => {
    setCreatedRow(dummyPlanSubjectData);
    setSuggestedPlanning(dummyPlanSubjectSuggestion);
    setLoading(false);
    setIsCreateModal(false);
  };

  const handleSubmitCreateModal = async () => {
    let clone = Object.assign({}, createdRow);
    delete clone.EmployeeName;
    const createdPlanSubject = await postPlanSubject(clone);
    if (createdPlanSubject) {
      const newListOfPlanSubjects: IPlanSubjectType[] = await getPlanSubjects();
      if (newListOfPlanSubjects) {
        dispatch(setSnackbarMessage("Tạo phiếu dự trù mới thành công"));
        dispatch(setListOfPlanSubjects(newListOfPlanSubjects));
      }
    }
    onCloseCreateModal();
  };

  const getSubjectPlanningSuggestion = async () => {
    setLoading(true);
    let planningData = await getPlanningSuggestion(
      suggestedPlanning.Semester,
      suggestedPlanning.Schoolyear,
      suggestedPlanning.SubjectId
    );
    if (planningData) {
      setLoading(false);
      console.log("planningData :", planningData);
      setCreatedRow(planningData);
    }
  };

  const onOpenSummaryModal = () => {
    setIsSummaryModal(true);
  };

  const onCloseSummaryModal = () => {
    setIsSummaryModal(false);
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
            "mrt-row-expand",
            "mrt-row-numbers",
            ...columns.map((x) => x.accessorKey || ""),
            "mrt-row-actions",
          ],
        }}
        renderTopToolbarCustomActions={() => (
          <h3 style={{ margin: "0px" }}>
            <b>
              <KeyboardArrowRightIcon
                style={{ margin: "0px", fontSize: "30px", paddingTop: "15px" }}
              ></KeyboardArrowRightIcon>
            </b>
            <span>Thông tin phiếu dự trù</span>
          </h3>
        )}
        renderDetailPanel={({ row }) => (
          <>
            <DetailChemicalTable
              chemicalData={row.original.listChemical}
              columns={chemicalInPlanSubjectTableColumns.current}
            />
            <DetailDeviceTable
              deviceData={row.original.listDevice}
              columns={deviceInPlanSubjectTableColumns.current}
            />
            <DetailInstrumentTable
              deviceData={row.original.listInstrument}
              columns={instrumentInPlanSubjectTableColumns.current}
            />
          </>
        )}
        renderRowActions={({ row, table }) => (
          <>
            <Tooltip arrow placement="left" title="Sửa thông tin phiếu dự trù">
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá phiếu dự trù">
              <IconButton
                color="error"
                onClick={() => handleOpenDeleteModal(row)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        )}
        renderBottomToolbarCustomActions={() => (
          <div className="bottomButton" style={{ display: "flex" }}>
            <Tooltip title="Tạo phiếu dự trù mới" placement="top">
              <Button
                color="primary"
                onClick={handleOpenCreateModal}
                variant="contained"
                style={{ margin: "10px" }}
              >
                <AddIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title=" Xem tổng hợp dự trù" placement="right-start">
              <Button
                color="success"
                onClick={onOpenSummaryModal}
                variant="contained"
                style={{ margin: "10px" }}
              >
                Xem tổng hợp
              </Button>
            </Tooltip>
          </div>
        )}
      />

      <Dialog open={isEditModal}>
        <DialogTitle textAlign="center">
          <b>Sửa thông tin phiếu dự trù</b>
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ marginTop: "10px" }}
          >
            <Stack
              sx={{
                width: "100%",
                minWidth: { xs: "400px", sm: "460px", md: "500px" },
                gap: "1.5rem",
              }}
            >
              {columns.map((column) => {
                if (column.accessorKey === "PlanId") {
                  return (
                    <TextField
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      disabled
                      defaultValue={column.id && updatedRow[column.id]}
                    />
                  );
                } else if (column.accessorKey === "Note") {
                  return (
                    <TextareaAutosize
                      key="Note"
                      aria-label="minimum height"
                      minRows={3}
                      placeholder="Nhập ghi chú..."
                      defaultValue={updatedRow["Note"]}
                      onChange={(e) =>
                        setUpdatedRow({ ...updatedRow, Note: e.target.value })
                      }
                    />
                  );
                } else if (column.accessorKey === "EmployeeName") {
                  return (
                    <Autocomplete
                      key={column.accessorKey}
                      options={employeeDataValue}
                      noOptionsText="Không có kết quả trùng khớp"
                      value={
                        employeeDataValue.find(
                          (x: any) => x.id === updatedRow.EmployeeId
                        ) || null
                      }
                      getOptionLabel={(option) => option?.label}
                      renderInput={(params) => {
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
                          EmployeeId: value?.id,
                          EmployeeName: value?.name,
                        });
                      }}
                    />
                  );
                } else if (column.accessorKey === "SubjectName") {
                  return (
                    <Autocomplete
                      key={column.accessorKey}
                      options={subjectDataValue}
                      noOptionsText="Không có kết quả trùng khớp"
                      value={
                        subjectDataValue.find(
                          (x: any) => x.id === updatedRow.SubjectId
                        ) || null
                      }
                      getOptionLabel={(option) => option?.label}
                      renderInput={(params) => {
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
                          SubjectId: value?.id,
                          SubjectName: value?.name,
                        });
                      }}
                    />
                  );
                } else if (column.accessorKey === "Semester") {
                  const list = ["1", "2", "3"];
                  return (
                    <FormControl
                      sx={{ m: 0, minWidth: 120 }}
                      key={column.accessorKey}
                    >
                      <InputLabel id="Semester-select-required-label">
                        Học kỳ
                      </InputLabel>
                      <Select
                        labelId="Semester-select-required-label"
                        id="Semester-select-required"
                        value={
                          list.findIndex(
                            (x) => x === updatedRow.Semester.toString()
                          ) > -1
                            ? list
                                .findIndex(
                                  (x) => x === updatedRow.Semester.toString()
                                )
                                .toString()
                            : "1"
                        }
                        label="Học kỳ"
                        onChange={(e: SelectChangeEvent) =>
                          setUpdatedRow({
                            ...updatedRow,
                            Semester: Number(list[Number(e.target.value)]),
                          })
                        }
                      >
                        {list.map((x, idx) => (
                          <MenuItem key={idx} value={idx}>
                            {x}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                } else if (column.accessorKey === "Schoolyear") {
                  const list = ["2020-2021", "2021-2022", "2022-2023"];
                  return (
                    <FormControl
                      sx={{ m: 0, minWidth: 120 }}
                      key={column.accessorKey}
                    >
                      <InputLabel id="Schoolyear-select-required-label">
                        Năm học
                      </InputLabel>
                      <Select
                        labelId="Schoolyear-select-required-label"
                        id="Schoolyear-select-required"
                        value={
                          list.findIndex((x) => x === updatedRow.Schoolyear) >
                          -1
                            ? list
                                .findIndex((x) => x === updatedRow.Schoolyear)
                                .toString()
                            : "2022-2023"
                        }
                        label="Năm học"
                        onChange={(e: SelectChangeEvent) =>
                          setUpdatedRow({
                            ...updatedRow,
                            Schoolyear: list[Number(e.target.value)],
                          })
                        }
                      >
                        {list.map((x, idx) => (
                          <MenuItem key={idx} value={idx}>
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
            Sửa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isCreateModal}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "1000px", // Set your width here
            },
          },
        }}
      >
        <DialogTitle textAlign="center">
          <b>Tạo phiếu dự trù</b>
        </DialogTitle>
        <DialogContent sx={{ minWidth: "1000px" }}>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ marginTop: "10px" }}
          >
            <Stack
              sx={{
                width: "100%",
                minWidth: { xs: "400px", sm: "460px", md: "500px" },
                gap: "1.5rem",
              }}
            >
              <div className="suggestion" style={{ display: "flex" }}>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ mt: 1, mr: 3, minWidth: 50 }}
                >
                  Tra cứu:
                </Typography>
                <FormControl
                  sx={{ m: 0, mr: 1, minWidth: 100 }}
                  key={"semesterSuggestion"}
                >
                  <InputLabel id="Semester-select-required-label-suggestion">
                    Học kỳ
                  </InputLabel>
                  <Select
                    labelId="Semester-select-required-label-suggestion"
                    id="Semester-select-required-suggestion"
                    value={
                      semesterValue.findIndex(
                        (x) => x === suggestedPlanning.Semester.toString()
                      ) > -1
                        ? semesterValue
                            .findIndex(
                              (x) => x === suggestedPlanning.Semester.toString()
                            )
                            .toString()
                        : "1"
                    }
                    label="Học kỳ"
                    onChange={(e: SelectChangeEvent) =>
                      setSuggestedPlanning({
                        ...suggestedPlanning,
                        Semester: semesterValue[Number(e.target.value)],
                      })
                    }
                  >
                    {semesterValue.map((x, idx) => (
                      <MenuItem key={idx} value={idx}>
                        {x}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  sx={{ m: 0, mr: 1, minWidth: 150 }}
                  key={"schoolYearSuggestion"}
                >
                  <InputLabel id="schoolYear-select-required-label-suggestion">
                    Năm học
                  </InputLabel>
                  <Select
                    labelId="schoolYear-select-required-label-suggestion"
                    id="schoolYear-select-required-suggestion"
                    value={
                      schoolYearValue.findIndex(
                        (x) => x === suggestedPlanning.Schoolyear.toString()
                      ) > -1
                        ? schoolYearValue
                            .findIndex(
                              (x) =>
                                x === suggestedPlanning.Schoolyear.toString()
                            )
                            .toString()
                        : "2022-2023"
                    }
                    label="Năm học"
                    onChange={(e: SelectChangeEvent) =>
                      setSuggestedPlanning({
                        ...suggestedPlanning,
                        Schoolyear: schoolYearValue[Number(e.target.value)],
                      })
                    }
                  >
                    {schoolYearValue.map((x, idx) => (
                      <MenuItem key={idx} value={idx}>
                        {x}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Autocomplete
                  key={"subjectSuggestion"}
                  options={subjectDataValue}
                  style={{ margin: 0, marginRight: 8, minWidth: 380 }}
                  noOptionsText="Không có kết quả trùng khớp"
                  disableClearable
                  value={
                    subjectDataValue.find(
                      (x: any) => x.id === suggestedPlanning.SubjectId
                    ) || null
                  }
                  getOptionLabel={(option) => option?.label}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label={"Môn học"}
                        placeholder="Nhập để tìm kiếm"
                      />
                    );
                  }}
                  onChange={(event, value) => {
                    setSuggestedPlanning({
                      ...suggestedPlanning,
                      SubjectId: value?.id,
                      SubjectName: value?.name,
                    });
                  }}
                />
                <Button
                  sx={{ minWidth: 100, marginRight: 2 }}
                  color="primary"
                  onClick={getSubjectPlanningSuggestion}
                  variant="contained"
                >
                  Tìm kiếm
                </Button>
                {loading && (
                  <CircularProgress disableShrink sx={{ size: 100 }} />
                )}
              </div>
              {createdRow.PlanId && !loading && (
                <>
                  <Typography variant="h6" noWrap component="div">
                    Thông tin phiếu dự trù:
                  </Typography>
                  {infoInSuggestedPlanning.map((item) => {
                    if (item.id === "Note") {
                      return (
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={3}
                          placeholder="Nhập ghi chú..."
                          defaultValue={createdRow["Note"]}
                          onChange={(e) =>
                            setCreatedRow({
                              ...createdRow,
                              Note: e.target.value,
                            })
                          }
                        />
                      );
                    } else {
                      return (
                        <TextField
                          key={item.id}
                          label={item.name}
                          name={item.id}
                          defaultValue={createdRow[item.id]}
                          disabled
                        />
                      );
                    }
                  })}
                  <div className="planningGroup" style={{ display: "flex" }}>
                    <TextField
                      key={"NumClass"}
                      label={"SL lớp"}
                      name={"NumClass"}
                      sx={{ minWidth: "250px", marginRight: "10px" }}
                      defaultValue={createdRow["NumClass"]}
                      disabled
                    />
                    <TextField
                      key={"NumGroupOfClass"}
                      label={"SL nhóm"}
                      name={"NumGroupOfClass"}
                      sx={{ minWidth: "250px", marginRight: "10px" }}
                      defaultValue={createdRow["NumGroupOfClass"]}
                      disabled
                    />
                    <Autocomplete
                      key={"EmployeeName"}
                      options={employeeDataValue}
                      noOptionsText="Không có kết quả trùng khớp"
                      sx={{ width: "450px" }}
                      value={
                        employeeDataValue.find(
                          (x: any) => x.id === createdRow.EmployeeId
                        ) || null
                      }
                      getOptionLabel={(option) => option?.label}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            label={"Người lập"}
                            placeholder="Nhập để tìm kiếm"
                          />
                        );
                      }}
                      onChange={(event, value) => {
                        setCreatedRow({
                          ...createdRow,
                          EmployeeId: value?.id,
                          EmployeeName: value?.name,
                        });
                      }}
                    />
                  </div>

                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="Nhập ghi chú..."
                    defaultValue={createdRow["Note"]}
                    onChange={(e) =>
                      setCreatedRow({ ...createdRow, Note: e.target.value })
                    }
                  />
                  <ChemicalPlanning
                    isOpen={true}
                    currentValue={createdRow.listChemical}
                  />
                  <DevicePlanning
                    isOpen={true}
                    currentValue={createdRow.listDevice}
                  />
                  <InstrumentPlanning
                    isOpen={true}
                    currentValue={createdRow.listInstrument}
                  />
                </>
              )}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={onCloseCreateModal}>Hủy</Button>
          {createdRow.PlanId && (
            <Button
              color="primary"
              onClick={handleSubmitCreateModal}
              variant="contained"
            >
              Tạo
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteModal}>
        <DialogTitle textAlign="center">
          <b>Xoá phiếu dự trù</b>
        </DialogTitle>
        <DialogContent>
          <div>
            Bạn có chắc muốn xoá phiếu dự trù {`${deletedRow.PlanId}`} không?
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
      <SummaryTable isOpen={isSummaryModal} onClose={onCloseSummaryModal} />
    </>
  );
};

export default PlanSubjectTable;
