import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from "material-react-table";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import moment from 'moment';
import { dummyPOChemical, dummyPODevice, dummyPurchaseOrderData, IOrderChemicalType, IOrderDeviceType, IPurchaseOrderType } from "../../types/purchaseOrderType";
import { setSnackbarMessage } from '../../pages/appSlice';
import { Add, KeyboardArrowRight, Delete, Edit } from '@mui/icons-material';
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
  Autocomplete
} from '@mui/material';
import {
  deletePurchaseOrder,
  getPurchaseOrders,
  postPurchaseOrder,
  updatePurchaseOrder
} from "../../services/purchaseOrderServices";
import { setCurrentChemicalPO, setCurrentDevicePO, setCurrentPurchaseOrder, setListOfPurchaseOrders } from "./purchaseOrderSlice";
import PurchaseOrderChemicalTable from "./POChemicalTable";
import PurchaseOrderDeviceTable from "./PODeviceTable";
import { ColumnType } from "./Utils";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import DetailPOChemical from "./Details/DetailPOChemical";
import CreatePOChemicalDialog from "./Dialog/CreatePOChemicalDialog";
import EditPOChemicalDialog from "./Dialog/EditPOChemicalDialog";
import DeletePOChemicalDialog from "./Dialog/DeletePOChemicalDialog";
import DetailPODevice from "./Details/DetailPODevice";
import CreatePODeivceDialog from "./Dialog/CreatePODeviceDialog";
import EditPODeviceDialog from "./Dialog/EditPODeviceDialog";
import DeletePODeviceDialog from "./Dialog/DeletePODeviceDialog";

export const PurchaseOrderTable: FC = () => {
  const purchaseOrdersData = useAppSelector((state: RootState) => state.purchaseOrder.listOfPurchaseOrders);
  const supplierData = useAppSelector((state: RootState) => state.supplier.listOfSuppliers);
  const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
  const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);
  const currentPurchaseOrder = useAppSelector((state: RootState) => state.purchaseOrder.currentPurchaseOrder);
  const { currentChemicalPO, currentDevicePO } = useAppSelector((state: RootState) => state.purchaseOrder);

  const dispatch = useAppDispatch();

  const [tableData, setTableData] = useState<IPurchaseOrderType[]>([]);
  const [employeeDataValue, setEmployeeDataValue] = useState<any>([]);
  const [departmentDataValue, setDepartmentDataValue] = useState<any>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [previousModal, setPreviousModal] = useState<string>('create');

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);

  const [isCreatePOChemicalModal, setIsCreatePOChemicalModal] = useState<boolean>(false);
  const [isEditPOChemicalModal, setIsEditPOChemicalModal] = useState<boolean>(false);
  const [isDeletePOChemicalModal, setIsDeletePOChemicalModal] = useState<boolean>(false);
  const [isCreatePODeviceModal, setIsCreatePODeviceModal] = useState<boolean>(false);
  const [isEditPODeviceModal, setIsEditPODeviceModal] = useState<boolean>(false);
  const [isDeletePODeviceModal, setIsDeletePODeviceModal] = useState<boolean>(false);

  useEffect(() => {
    if (purchaseOrdersData.length > 0) {
      let formatedPurchaseOrderData = purchaseOrdersData.map((order: IPurchaseOrderType) => {
        let supplierInfoIdx = supplierData.findIndex(item => item.SupplierId === order.SupplierId);
        let employeeInfoIdx = employeeData.findIndex(item => item.EmployeeId === order.EmployeeId);
        let departmentInfoIdx = departmentData.findIndex(item => item.DepartmentId === order.DepartmentId);
        return {
          ...order,
          "formatedOrderDate": moment.unix(order.OrderDate).format('DD/MM/YYYY'),
          "SupplierName": supplierInfoIdx > -1 ? supplierData[supplierInfoIdx].Name : "",
          "EmployeeName": employeeInfoIdx > -1 ? employeeData[employeeInfoIdx].Fullname : "",
          "DepartmentName": departmentInfoIdx > -1 ? departmentData[departmentInfoIdx].DepartmentName : "",
        }
      })
      setTableData(formatedPurchaseOrderData);
    }
  }, [purchaseOrdersData]);

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
      cell: MRT_Cell<IPurchaseOrderType>,
    ): MRT_ColumnDef<IPurchaseOrderType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  )

  const columns = useMemo<MRT_ColumnDef<IPurchaseOrderType>[]>(
    () => [
      {
        accessorKey: 'OrderId',
        header: 'ID',
        size: 100,
      },
      {
        accessorKey: 'Content',
        header: 'Nội dung',
        size: 140,
      },
      {
        accessorKey: 'formatedOrderDate',
        header: 'Thời gian nhập',
        size: 140,
      },
      {
        accessorKey: 'EmployeeName',
        header: 'Người nhập',
        size: 140,
      },
      {
        accessorKey: 'DepartmentName',
        header: 'Phòng ban',
        size: 140,
      },
      {
        accessorKey: 'Note',
        header: 'Ghi chú',
        size: 100,
      },
    ],
    [getCommonEditTextFieldProps],
  );

  const POChemicalTableColumns = useRef<ColumnType[]>([
    {
      id: 'ChemDetailId',
      header: 'Mã nhập',
    },
    {
      id: 'ChemicalId',
      header: 'Mã hoá chất',
    },
    {
      id: 'ChemicalName',
      header: 'Tên hoá chất',
    },
    {
      id: 'AmountOriginal',
      header: 'SL nhập',
    },
    {
      id: 'Unit',
      header: 'Đơn vị',
    },
    {
      id: 'ManufacturingDate',
      header: 'Ngày sản xuất',
      type: 'date'
    },
    {
      id: 'ExpiryDate',
      header: 'Ngày hết hạn',
      type: 'date'
    },
    {
      id: 'LotNumber',
      header: 'Số lô',
    },
    {
      id: 'Price',
      header: 'Giá',
    },
    {
      id: 'ManufacturerName',
      header: 'Nhà sản xuất',
    },
  ]);

  const PODeviceTableColumns = useRef<ColumnType[]>([
    {
      id: 'DeviceDetailId',
      header: 'Mã nhập',
    },
    {
      id: 'DeviceId',
      header: 'Mã thiết bị',
    },
    {
      id: 'DeviceName',
      header: 'Tên thiết bị',
    },
    {
      id: 'QuantityOriginal',
      header: 'SL nhập',
    },
    {
      id: 'Unit',
      header: 'Đơn vị',
    },
    {
      id: 'Model',
      header: 'Mẫu',
    },
    {
      id: 'Origin',
      header: 'Xuất xứ',
    },
    {
      id: 'Price',
      header: 'Giá',
    },
    {
      id: 'ManufacturerName',
      header: 'Nhà sản xuất',
    },
  ]);

  const handleOpenEditModal = (row: any) => {
    dispatch(setCurrentPurchaseOrder(row.original));
    setIsEditModal(true);
    dispatch(setCurrentPurchaseOrder(row.original));
  }

  const onCloseEditModal = () => {
    dispatch(setCurrentPurchaseOrder(dummyPurchaseOrderData));
    setIsEditModal(false);
    dispatch(setCurrentPurchaseOrder(dummyPurchaseOrderData));
  }

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updatePurchaseOrder(currentPurchaseOrder.OrderId, currentPurchaseOrder);
    if (isUpdatedSuccess) {
      dispatch(setSnackbarMessage("Cập nhật thông tin phiếu nhập thành công"));
      let updatedIdx = purchaseOrdersData.findIndex(item => item.OrderId === currentPurchaseOrder.OrderId);
      let newListOfOrders = [
        ...purchaseOrdersData.slice(0, updatedIdx),
        currentPurchaseOrder,
        ...purchaseOrdersData.slice(updatedIdx + 1,)
      ]
      dispatch(setListOfPurchaseOrders(newListOfOrders));
    }

    onCloseEditModal();
  }

  const handleOpenDeleteModal = (row: any) => {
    dispatch(setCurrentPurchaseOrder((row.original)));
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    dispatch(setCurrentPurchaseOrder((dummyPurchaseOrderData)));
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deletePurchaseOrder(currentPurchaseOrder.OrderId);
    dispatch(setSnackbarMessage("Xóa thông tin phiếu nhập thành công"));
    let deletedIdx = purchaseOrdersData.findIndex(item => item.OrderId === currentPurchaseOrder.OrderId);
    let newListOfOrders = [...purchaseOrdersData.slice(0, deletedIdx), ...purchaseOrdersData.slice(deletedIdx + 1,)]
    dispatch(setListOfPurchaseOrders(newListOfOrders));

    onCloseDeleteModal();
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    dispatch(setCurrentPurchaseOrder(dummyPurchaseOrderData));
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdOrder = await postPurchaseOrder({
      "OrderId": currentPurchaseOrder.OrderId,
      "OrderDate": currentPurchaseOrder.OrderDate,
      "Content": currentPurchaseOrder.Content,
      "Note": currentPurchaseOrder.Note,
      "SupplierId": currentPurchaseOrder.SupplierId,
      "SupplierName": currentPurchaseOrder.SupplierName,
      "EmployeeId": currentPurchaseOrder.EmployeeId,
      "EmployeeName": currentPurchaseOrder.EmployeeName,
      "DepartmentId": currentPurchaseOrder.DepartmentId,
      "DepartmentName": currentPurchaseOrder.DepartmentName,
      "listChemDetail": currentPurchaseOrder.listChemDetail,
      "listDevDetail": currentPurchaseOrder.listDevDetail,
    })
    if (createdOrder) {
      const newListOfOrders: IPurchaseOrderType[] = await getPurchaseOrders();
      if (newListOfOrders) {
        dispatch(setSnackbarMessage("Tạo thông tin phiếu nhập mới thành công"));
        dispatch(setListOfPurchaseOrders(newListOfOrders));
      }
    }
    onCloseCreateModal();
  }

  const handleOpenCreatePOChemicalModal = () => {
    setIsCreatePOChemicalModal(true);
    if (isEditModal) {
      setIsEditModal(false);
      setPreviousModal('edit');
    } else {
      setIsCreateModal(false);
      setPreviousModal('create');
    }
  }

  const onCloseCreatePOChemicalModal = () => {
    setIsCreatePOChemicalModal(false);
    dispatch(setCurrentChemicalPO(dummyPOChemical));
    if (previousModal === 'create') {
      setIsCreateModal(true);
    } else {
      setIsEditModal(true);
    }
  }

  const handleSubmitCreatePOChemicalModal = () => {
    dispatch(setCurrentPurchaseOrder({
      ...currentPurchaseOrder,
      "listChemDetail": [...currentPurchaseOrder.listChemDetail, currentChemicalPO]
    }))

    onCloseCreatePOChemicalModal();
  }

  const handleOpenEditPOChemicalModal = (row: any) => {
    dispatch(setCurrentChemicalPO(row.original));
    setIsEditPOChemicalModal(true);
    if (isEditModal) {
      setIsEditModal(false);
      setPreviousModal('edit');
    } else {
      setIsCreateModal(false);
      setPreviousModal('create');
    }
  }

  const onCloseEditPOChemicalModal = () => {
    setIsEditPOChemicalModal(false);
    dispatch(setCurrentChemicalPO(dummyPOChemical));
    if (previousModal === 'create') {
      setIsCreateModal(true);
    } else {
      setIsEditModal(true);
    }
  }

  const handleSubmitEditPOChemicalModal = () => {
    let updatedIdx = currentPurchaseOrder.listChemDetail.findIndex((item: IOrderChemicalType) => item.ChemDetailId === currentChemicalPO.ChemDetailId);
    let currentChemicalPOClone = Object.assign({}, currentChemicalPO);
    delete currentChemicalPOClone.formatedManufacturingDate;
    delete currentChemicalPOClone.formatedExpiryDate;

    dispatch(setCurrentPurchaseOrder({
      ...currentPurchaseOrder,
      listChemDetail: [
        ...currentPurchaseOrder.listChemDetail.slice(0, updatedIdx),
        currentChemicalPOClone,
        ...currentPurchaseOrder.listChemDetail.slice(updatedIdx + 1,)
      ]
    }));

    onCloseEditPOChemicalModal();
  }

  const handleOpenDeletePOChemicalModal = (row: any) => {
    dispatch(setCurrentChemicalPO(row.original));
    setIsDeletePOChemicalModal(true);
    if (isEditModal) {
      setIsEditModal(false);
      setPreviousModal('edit');
    } else {
      setIsCreateModal(false);
      setPreviousModal('create');
    }
  }

  const onCloseDeletePOChemicalModal = () => {
    setIsDeletePOChemicalModal(false);
    dispatch(setCurrentChemicalPO(dummyPOChemical));
    if (previousModal === 'create') {
      setIsCreateModal(true);
    } else {
      setIsEditModal(true);
    }
  }

  const handleSubmitDeletePOChemicalModal = () => {
    let deletedIdx = currentPurchaseOrder.listChemDetail.findIndex((item: IOrderChemicalType) => item.ChemDetailId === currentChemicalPO.ChemDetailId);
    if (deletedIdx) {
      dispatch(setCurrentPurchaseOrder({
        ...currentPurchaseOrder,
        "listChemDetail": [
          ...currentPurchaseOrder.listChemDetail.slice(0, deletedIdx),
          ...currentPurchaseOrder.listChemDetail.slice(deletedIdx + 1,)
        ]
      }))
    }

    onCloseDeletePOChemicalModal();
  }


  const handleOpenCreatePODeviceModal = () => {
    setIsCreatePODeviceModal(true);
    if (isEditModal) {
      setIsEditModal(false);
      setPreviousModal('edit');
    } else {
      setIsCreateModal(false);
      setPreviousModal('create');
    }
  }

  const onCloseCreatePODeviceModal = () => {
    setIsCreatePODeviceModal(false);
    dispatch(setCurrentDevicePO(dummyPODevice));
    if (previousModal === 'create') {
      setIsCreateModal(true);
    } else {
      setIsEditModal(true);
    }
  }

  const handleSubmitCreatePODeviceModal = () => {
    dispatch(setCurrentPurchaseOrder({
      ...currentPurchaseOrder,
      "listDevDetail": [...currentPurchaseOrder.listDevDetail, currentDevicePO]
    }))

    onCloseCreatePODeviceModal();
  }

  const handleOpenEditPODeviceModal = (row: any) => {
    dispatch(setCurrentDevicePO(row.original));
    setIsEditPODeviceModal(true);
    if (isEditModal) {
      setIsEditModal(false);
      setPreviousModal('edit');
    } else {
      setIsCreateModal(false);
      setPreviousModal('create');
    }
  }

  const onCloseEditPODeviceModal = () => {
    setIsEditPODeviceModal(false);
    dispatch(setCurrentDevicePO(dummyPODevice));
    if (previousModal === 'create') {
      setIsCreateModal(true);
    } else {
      setIsEditModal(true);
    }
  }

  const handleSubmitEditPODeviceModal = () => {
    let updatedIdx = currentPurchaseOrder.listDevDetail.findIndex((item: IOrderDeviceType) => item.DeviceDetailId === currentDevicePO.DeviceDetailId);
    let currentChemicalPOClone = Object.assign({}, currentDevicePO);

    dispatch(setCurrentPurchaseOrder({
      ...currentPurchaseOrder,
      listDevDetail: [
        ...currentPurchaseOrder.listDevDetail.slice(0, updatedIdx),
        currentChemicalPOClone,
        ...currentPurchaseOrder.listDevDetail.slice(updatedIdx + 1,)
      ]
    }));

    onCloseEditPODeviceModal();
  }

  const handleOpenDeletePODeviceModal = (row: any) => {
    dispatch(setCurrentDevicePO(row.original));
    setIsDeletePODeviceModal(true);
    if (isEditModal) {
      setIsEditModal(false);
      setPreviousModal('edit');
    } else {
      setIsCreateModal(false);
      setPreviousModal('create');
    }
  }

  const onCloseDeletePODeviceModal = () => {
    setIsDeletePODeviceModal(false);
    dispatch(setCurrentDevicePO(dummyPODevice));
    if (previousModal === 'create') {
      setIsCreateModal(true);
    } else {
      setIsEditModal(true);
    }
  }

  const handleSubmitDeletePODeviceModal = () => {
    let deletedIdx = currentPurchaseOrder.listDevDetail.findIndex((item: IOrderDeviceType) => item.DeviceDetailId === currentDevicePO.DeviceDetailId);
    if (deletedIdx > -1) {
      dispatch(setCurrentPurchaseOrder({
        ...currentPurchaseOrder,
        "listDevDetail": [
          ...currentPurchaseOrder.listDevDetail.slice(0, deletedIdx),
          ...currentPurchaseOrder.listDevDetail.slice(deletedIdx + 1,)
        ]
      }))
    }

    onCloseDeletePODeviceModal();
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
            ...columns.map(item => item.accessorKey || ''),
            'mrt-row-actions'
          ]
        }}
        renderDetailPanel={({ row }) => (
          <>
            <PurchaseOrderChemicalTable
              chemicalData={row.original.listChemDetail}
              columns={POChemicalTableColumns.current}
            />
            <PurchaseOrderDeviceTable
              deviceData={row.original.listDevDetail}
              columns={PODeviceTableColumns.current}
            />
          </>
        )}
        renderTopToolbarCustomActions={() => (
          <h3 style={{ "margin": "0px" }}>
            <b><KeyboardArrowRight
              style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
            ></KeyboardArrowRight></b>
            <span>Thông tin phiếu nhập</span>
          </h3>
        )}
        renderRowActions={({ row, table }) => (
          <>
            <Tooltip arrow placement="left" title="Sửa thông tin phiếu nhập">
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá phiếu nhập">
              <IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        )}
        renderBottomToolbarCustomActions={() => (
          <Tooltip title="Tạo phiếu nhập mới" placement="right-start">
            <Button
              color="primary"
              onClick={handleOpenCreateModal}
              variant="contained"
              style={{ "margin": "10px" }}
            >
              <Add fontSize="small" />
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
              maxWidth: "1200px",  // Set your width here
            },
          },
        }}
      >
        <DialogTitle textAlign="center"><b>Sửa thông tin phiếu nhập</b></DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              <TextField
                disabled
                key={"OrderId"}
                label={"ID"}
                name="ID"
                defaultValue={currentPurchaseOrder["OrderId"]}
              />
              <div className="updatePOGroup" style={{ "display": "flex" }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    key={"UpdateOrderDate"}
                    label={"Thời gian nhập"}
                    value={new Date(currentPurchaseOrder["OrderDate"] * 1000)}
                    onChange={(val: any) => {
                      dispatch(setCurrentPurchaseOrder({
                        ...currentPurchaseOrder,
                        "formatedOrderDate": moment.unix(Date.parse(val) / 1000).format('DD/MM/YYYY'),
                        "OrderDate": Date.parse(val) / 1000
                      }))
                    }
                    }
                    renderInput={(params: any) => <TextField key="UpdateTextFieldFormatedOrderDate" {...params} />}
                    inputFormat='DD/MM/YYYY'
                  />
                </LocalizationProvider>

                <Autocomplete
                  key={"EmployeeName"}
                  options={employeeDataValue}
                  noOptionsText="Không có kết quả trùng khớp"
                  sx={{ "width": "450px", "margin": "0px 10px" }}
                  value={employeeDataValue.find((x: any) => x.id === currentPurchaseOrder.EmployeeId) || null}
                  getOptionLabel={option => option?.label}
                  renderInput={params => {
                    return (
                      <TextField
                        {...params}
                        label={"Người lập"}
                        placeholder="Nhập để tìm kiếm"
                      />
                    );
                  }}
                  onChange={(event, value) => {
                    dispatch(setCurrentPurchaseOrder({
                      ...currentPurchaseOrder,
                      "EmployeeId": value?.id,
                      "EmployeeName": value?.name,
                    }));
                  }}
                />

                <Autocomplete
                  key={"DepartmentName"}
                  options={departmentDataValue}
                  noOptionsText="Không có kết quả trùng khớp"
                  sx={{ "width": "450px" }}
                  value={departmentDataValue.find((x: any) => x.id === currentPurchaseOrder.DepartmentId) || null}
                  getOptionLabel={option => option?.label}
                  renderInput={params => {
                    return (
                      <TextField
                        {...params}
                        label={"Khoa/Phòng ban"}
                        placeholder="Nhập để tìm kiếm"
                      />
                    );
                  }}
                  onChange={(event, value) => {
                    dispatch(setCurrentPurchaseOrder({
                      ...currentPurchaseOrder,
                      "DepartmentId": value?.id,
                      "EmployeeName": value?.name,
                    }));
                  }}
                />
              </div>

              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Nhập ghi chú..."
                defaultValue={currentPurchaseOrder["Note"].toString()}
                onChange={(e) =>
                  dispatch(setCurrentPurchaseOrder({ ...currentPurchaseOrder, "Note": e.target.value }))
                }
              />
            </Stack>
          </form>

          <DetailPOChemical
            handleOpenCreateModal={handleOpenCreatePOChemicalModal}
            handleOpenEditModal={handleOpenEditPOChemicalModal}
            handleOpenDeleteModal={handleOpenDeletePOChemicalModal}
          />

          <DetailPODevice
            handleOpenCreateModal={handleOpenCreatePODeviceModal}
            handleOpenEditModal={handleOpenEditPODeviceModal}
            handleOpenDeleteModal={handleOpenDeletePODeviceModal}
          />

        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseEditModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitEditModal} variant="contained">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteModal}>
        <DialogTitle textAlign="center"><b>Xoá thông tin phiếu nhập</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin phiếu nhập {`${currentPurchaseOrder.OrderId}`} không?</div>
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
              maxWidth: "1200px",  // Set your width here
            },
          },
        }}
      >
        <DialogTitle textAlign="center"><b>Tạo thông tin phiếu nhập mới</b></DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >

              <div className="createPOGroup" style={{ "display": "flex" }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    key={"CreateOrderDate"}
                    label={"Thời gian nhập"}
                    value={new Date(currentPurchaseOrder["OrderDate"] * 1000)}
                    onChange={(val: any) => {
                      dispatch(setCurrentPurchaseOrder({
                        ...currentPurchaseOrder,
                        "formatedOrderDate": moment.unix(Date.parse(val) / 1000).format('DD/MM/YYYY'),
                        "OrderDate": Date.parse(val) / 1000
                      }))
                    }
                    }
                    renderInput={(params: any) => <TextField key="UpdateTextFieldFormatedOrderDate" {...params} />}
                    inputFormat='DD/MM/YYYY'
                  />
                </LocalizationProvider>

                <Autocomplete
                  key={"EmployeeName"}
                  options={employeeDataValue}
                  noOptionsText="Không có kết quả trùng khớp"
                  sx={{ "width": "450px", "margin": "0px 10px" }}
                  value={employeeDataValue.find((x: any) => x.id === currentPurchaseOrder.EmployeeId) || null}
                  getOptionLabel={option => option?.label}
                  renderInput={params => {
                    return (
                      <TextField
                        {...params}
                        label={"Người lập"}
                        placeholder="Nhập để tìm kiếm"
                      />
                    );
                  }}
                  onChange={(event, value) => {
                    dispatch(setCurrentPurchaseOrder({
                      ...currentPurchaseOrder,
                      "EmployeeId": value?.id,
                      "EmployeeName": value?.name,
                    }));
                  }}
                />

                <Autocomplete
                  key={"DepartmentName"}
                  options={departmentDataValue}
                  noOptionsText="Không có kết quả trùng khớp"
                  sx={{ "width": "450px" }}
                  value={departmentDataValue.find((x: any) => x.id === currentPurchaseOrder.DepartmentId) || null}
                  getOptionLabel={option => option?.label}
                  renderInput={params => {
                    return (
                      <TextField
                        {...params}
                        label={"Khoa/Phòng ban"}
                        placeholder="Nhập để tìm kiếm"
                      />
                    );
                  }}
                  onChange={(event, value) => {
                    dispatch(setCurrentPurchaseOrder({
                      ...currentPurchaseOrder,
                      "DepartmentId": value?.id,
                      "EmployeeName": value?.name,
                    }));
                  }}
                />
              </div>

              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Nhập ghi chú..."
                defaultValue={currentPurchaseOrder["Note"].toString()}
                onChange={(e) =>
                  dispatch(setCurrentPurchaseOrder({ ...currentPurchaseOrder, "Note": e.target.value }))
                }
              />
            </Stack>
          </form>

          <DetailPOChemical
            handleOpenCreateModal={handleOpenCreatePOChemicalModal}
            handleOpenEditModal={handleOpenEditPOChemicalModal}
            handleOpenDeleteModal={handleOpenDeletePOChemicalModal}
          />

          <DetailPODevice
            handleOpenCreateModal={handleOpenCreatePODeviceModal}
            handleOpenEditModal={handleOpenEditPODeviceModal}
            handleOpenDeleteModal={handleOpenDeletePODeviceModal}
          />

        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseCreateModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitCreateModal} variant="contained">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

      <CreatePOChemicalDialog
        isOpen={isCreatePOChemicalModal}
        columns={POChemicalTableColumns.current}
        onClose={onCloseCreatePOChemicalModal}
        handleSubmit={handleSubmitCreatePOChemicalModal}
      />

      <EditPOChemicalDialog
        isOpen={isEditPOChemicalModal}
        columns={POChemicalTableColumns.current}
        onClose={onCloseEditPOChemicalModal}
        handleSubmit={handleSubmitEditPOChemicalModal}
      />

      <DeletePOChemicalDialog
        isOpen={isDeletePOChemicalModal}
        onClose={onCloseDeletePOChemicalModal}
        handleSubmit={handleSubmitDeletePOChemicalModal}
      />

      <CreatePODeivceDialog
        isOpen={isCreatePODeviceModal}
        columns={PODeviceTableColumns.current}
        onClose={onCloseCreatePODeviceModal}
        handleSubmit={handleSubmitCreatePODeviceModal}
      />

      <EditPODeviceDialog
        isOpen={isEditPODeviceModal}
        columns={PODeviceTableColumns.current}
        onClose={onCloseEditPODeviceModal}
        handleSubmit={handleSubmitEditPODeviceModal}
      />

      <DeletePODeviceDialog
        isOpen={isDeletePODeviceModal}
        onClose={onCloseDeletePODeviceModal}
        handleSubmit={handleSubmitDeletePODeviceModal}
      />
    </>
  )
}