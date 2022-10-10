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
import { dummyChemicalData, IChemicalType } from '../../types/chemicalType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteChemical, getChemicals, postChemical, updateChemical } from '../../services/chemicalServices';
import { RootState } from '../../store';
import { setListOfChemicals } from './chemicalSlice';

const ChemicalTable: FC = () => {
  const chemicalData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
  const dispatch = useAppDispatch();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IChemicalType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const [updatedRow, setUpdatedRow] = useState<any>(dummyChemicalData);
  const [deletedRow, setDeletedRow] = useState<any>(dummyChemicalData);
  const [createdRow, setCreatedRow] = useState<any>(dummyChemicalData);

  const getTableData = async () => {
    const listOfChemical: IChemicalType[] = await getChemicals();
    if (listOfChemical) {
      dispatch(setListOfChemicals(listOfChemical));
    }
  }

  useEffect(() => {
    getTableData();
  }, [])

  useEffect(() => {
    setTableData(chemicalData);
  }, [chemicalData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IChemicalType>,
    ): MRT_ColumnDef<IChemicalType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IChemicalType>[]>(
    () => [
      {
        accessorKey: 'ChemicalId',
        header: 'Id hoá chất',
        enableColumnOrdering: true,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 50,
      },
      {
        accessorKey: 'ChemicalName',
        header: 'Tên hoá chất',
        size: 100,
      },
      {
        accessorKey: 'Specifications',
        header: 'Thông số',
        size: 140,
      },
      {
        accessorKey: 'Origin',
        header: 'Nguồn gốc',
        size: 140,
      },
      {
        accessorKey: 'Unit',
        header: 'Đơn vị',
        size: 140,
      },
      {
        accessorKey: 'Quantity',
        header: 'Số lượng',
        size: 140,
      },
      {
        accessorKey: 'ManufacturerId',
        header: 'Id nhà sản xuất',
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
    setIsEditModal(false);
  }

  const handleSubmitEditModal = async () => {
    const isUpdatedSuccess = await updateChemical(updatedRow.ChemicalId, updatedRow);
    if (isUpdatedSuccess) {
      let updatedIdx = chemicalData.findIndex(x => x.ChemicalId === updatedRow.ChemicalId);
      let newListOfChemicals = [...chemicalData.slice(0, updatedIdx), updatedRow, ...chemicalData.slice(updatedIdx + 1,)]
      dispatch(setListOfChemicals(newListOfChemicals));
    }

    setIsEditModal(false);
    setUpdatedRow(dummyChemicalData);
  }

  const handleOpenDeleteModal = (row: any) => {
    setDeletedRow(row.original);
    setIsDeleteModal(true);
  }

  const onCloseDeleteModal = () => {
    setIsDeleteModal(false);
  }

  const handleSubmitDeleteModal = async () => {
    await deleteChemical(deletedRow.ChemicalId);

    let deletedIdx = chemicalData.findIndex(x => x.ChemicalId === deletedRow.ChemicalId);
    let newListOfChemicals = [...chemicalData.slice(0, deletedIdx), ...chemicalData.slice(deletedIdx + 1,)]
    dispatch(setListOfChemicals(newListOfChemicals));

    setIsDeleteModal(false);
    setDeletedRow(dummyChemicalData);
  }

  const handleOpenCreateModal = (row: any) => {
    setIsCreateModal(true);
  }

  const onCloseCreateModal = () => {
    setIsCreateModal(false);
  }

  const handleSubmitCreateModal = async () => {
    const createdChemical = await postChemical({
      "ChemicalName": createdRow.ChemicalName, 
      "Specifications": createdRow.Specifications, 
      "Origin": createdRow.Origin, 
      "Unit": createdRow.Unint, 
      "Quantity": createdRow.Quantity, 
      "ManufacturerId": createdRow.ManufacturerId
    })

    if(createdChemical){
      const newListOfChemicals: IChemicalType[] = await getChemicals();
      if(newListOfChemicals){
        dispatch(setListOfChemicals(newListOfChemicals));
      }
    }
    setIsCreateModal(false);
    setCreatedRow(dummyChemicalData);
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
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Sửa thông tin hoá chất">
              <IconButton onClick={() => handleOpenEditModal(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Xoá thông tin hoá chất">
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
            Tạo hoá chất mới
          </Button>
        )}
      />

      <Dialog open={isEditModal}>
        <DialogTitle textAlign="center"><b>Sửa thông tin hoá chất</b></DialogTitle>
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
                column.id === "ChemicalId" ?
                  <TextField
                    disabled
                    key="ChemicalId"
                    label="ChemicalId"
                    name="ChemicalId"
                    defaultValue={updatedRow["ChemicalId"]}
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
          <Button onClick={onCloseEditModal}>Huỷ</Button>
          <Button color="primary" onClick={handleSubmitEditModal} variant="contained">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteModal}>
        <DialogTitle textAlign="center"><b>Xoá thông tin hoá chất</b></DialogTitle>
        <DialogContent>
          <div>Bạn có chắc muốn xoá thông tin hoá chất {`${deletedRow.ChemicalName}`} không?</div>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onCloseDeleteModal}>Huỷ</Button>
          <Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCreateModal}>
        <DialogTitle textAlign="center"><b>Tạo thông tin hoá chất</b></DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              {columns.slice(1, ).map((column) => (
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
          <Button onClick={onCloseCreateModal}>Huỷ</Button>
          <Button color="primary" onClick={handleSubmitCreateModal} variant="contained">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default ChemicalTable;
