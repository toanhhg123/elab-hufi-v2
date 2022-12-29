import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from "material-react-table";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import moment from 'moment';
import { dummyPurchaseOrderData, IPurchaseOrderType } from "../../types/purchaseOrderType";
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
import { setListOfPurchaseOrders } from "./purchaseOrderSlice";
import PurchaseOrderChemicalTable from "./POChemicalTable";
import PurchaseOrderDeviceTable from "./PODeviceTable";
import { ColumnType } from "./Utils";

export const PurchaseOrderTable: FC = () => {
  const purchaseOrdersData = useAppSelector((state: RootState) => state.purchaseOrder.listOfPurchaseOrders);
  const supplierData = useAppSelector((state: RootState) => state.supplier.listOfSuppliers);
  const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
  const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);
  const dispatch = useAppDispatch();

  const [tableData, setTableData] = useState<IPurchaseOrderType[]>([]);
  const [employeeDataValue, setEmployeeDataValue] = useState<any>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);

  const [updatedRow, setUpdatedRow] = useState<any>(dummyPurchaseOrderData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyPurchaseOrderData);
  const [createdRow, setCreatedRow] = useState<any>(dummyPurchaseOrderData);

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
        header: 'Thời gian Nhập',
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
    setUpdatedRow(row.original);
    setIsEditModal(true);
  }

  const onCloseEditModal = () => {
    setUpdatedRow(dummyPurchaseOrderData);
    setIsEditModal(false);
  }

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updatePurchaseOrder(updatedRow.OrderId, updatedRow);
    if (isUpdatedSuccess) {
      dispatch(setSnackbarMessage("Cập nhật thông tin phiếu nhập thành công"));
      let updatedIdx = purchaseOrdersData.findIndex(item => item.OrderId === updatedRow.OrderId);
      let newListOfOrders = [...purchaseOrdersData.slice(0, updatedIdx), updatedRow, ...purchaseOrdersData.slice(updatedIdx + 1,)]
      dispatch(setListOfPurchaseOrders(newListOfOrders));
    }

    onCloseEditModal();
  }

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    setDeletedRow(dummyPurchaseOrderData);
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deletePurchaseOrder(deletedRow.OrderId);
    dispatch(setSnackbarMessage("Xóa thông tin phiếu nhập thành công"));
    let deletedIdx = purchaseOrdersData.findIndex(item => item.OrderId === deletedRow.OrderId);
    let newListOfOrders = [...purchaseOrdersData.slice(0, deletedIdx), ...purchaseOrdersData.slice(deletedIdx + 1,)]
    dispatch(setListOfPurchaseOrders(newListOfOrders));

    onCloseDeleteModal();
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setCreatedRow(dummyPurchaseOrderData);
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdOrder = await postPurchaseOrder({
      "OrderId": createdRow.OrderId,
      "OrderDate": createdRow.OrderDate,
      "Content": createdRow.Content,
      "Note": createdRow.Note,
      "SupplierId": createdRow.SupplierId,
      "SupplierName": createdRow.SupplierName,
      "EmployeeId": createdRow.EmployeeId,
      "EmployeeName": createdRow.EmployeeName,
      "DepartmentId": createdRow.DepartmentId,
      "DepartmentName": createdRow.DepartmentName,
      "listChemDetail": createdRow.listChemDetail,
      "listDevDetail": createdRow.listDevDetail,
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
            {row.original.listChemDetail.length > 0 &&
              <PurchaseOrderChemicalTable
                chemicalData={row.original.listChemDetail}
                columns={POChemicalTableColumns.current}
              />}
            {row.original.listDevDetail.length > 0 &&
              <PurchaseOrderDeviceTable
                deviceData={row.original.listDevDetail}
                columns={PODeviceTableColumns.current}
              />}
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

      <Dialog open={isEditModal}>
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
              {columns.map((column) => {
                if (column.id === "Note") {
                  return <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="Nhập ghi chú..."
                    defaultValue={updatedRow["Note"]}
                    onChange={(e) =>
                      setUpdatedRow({ ...updatedRow, "Note": e.target.value })
                    }
                  />
                }

                if (column.accessorKey === "EmployeeName") {
                  return <Autocomplete
                    key={"EmployeeName"}
                    options={employeeDataValue}
                    noOptionsText="Không có kết quả trùng khớp"
                    sx={{ "width": "450px" }}
                    value={employeeDataValue.find((x: any) => x.id === updatedRow.EmployeeId) || null}
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
                      setUpdatedRow({
                        ...updatedRow,
                        "EmployeeId": value?.id,
                        "EmployeeName": value?.name,
                      });
                    }}
                  />
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
        <DialogTitle textAlign="center"><b>Xoá thông tin phiếu nhập</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin phiếu nhập {`${deletedRow.OrderId}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Hủy</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
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
              {columns.map((column) => (
                column.id === "Note" ?
                  <TextareaAutosize
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
  )
}