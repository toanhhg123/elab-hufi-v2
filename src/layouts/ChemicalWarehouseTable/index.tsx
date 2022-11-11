import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from 'material-react-table';
import { useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IChemicalWarehouseType } from '../../types/chemicalWarehouseType';
import ChemicalDetailTable from './ChemicalDetailTable';

const ChemicalWarehouseTable: FC = () => {
  const chemicalWarehouseData: IChemicalWarehouseType[] = useAppSelector((state: RootState) => state.chemicalWarehouse.listOfChemicalWarehouse);

  const [tableData, setTableData] = useState<IChemicalWarehouseType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  useEffect(() => {
    setTableData(chemicalWarehouseData);
  }, [chemicalWarehouseData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IChemicalWarehouseType>,
    ): MRT_ColumnDef<IChemicalWarehouseType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IChemicalWarehouseType>[]>(
    () => [
      {
        accessorKey: 'ChemicalId',
        header: 'Id hoá chất',
        size: 100,
      },
      {
        accessorKey: 'ChemicalName',
        header: 'Tên hoá chất',
        size: 100,
      },
      {
        accessorKey: 'Specifications',
        header: 'Thông số',
        size: 100,
      },
      {
        accessorKey: 'Origin',
        header: 'Nguồn gốc',
        size: 100,
      },
      {
        accessorKey: 'Unit',
        header: 'Đơn vị',
        size: 100,
      },
      {
        accessorKey: 'AmountOriginal',
        header: 'Lượng ban đầu',
        size: 100,
      },
      {
        accessorKey: 'AmountExport',
        header: 'Lượng xuất',
        size: 100,
      },
      {
        accessorKey: 'AmountRemain',
        header: 'Lượng còn lại',
        size: 100,
      },
    ],
    [getCommonEditTextFieldProps],
  );

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
            ...columns.map(item => item.accessorKey || '')
          ]
        }}
        renderDetailPanel={({ row }) => (
          <ChemicalDetailTable chemicalDetail={row.original.listChemicalDetail} />
        )}
        renderTopToolbarCustomActions={() => (
          <h3 style={{ "margin": "0px" }}>
            <b><KeyboardArrowRightIcon
              style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
            ></KeyboardArrowRightIcon></b>
            <span>Thông tin hoá chất</span>
          </h3>
        )}
      />
    </>
  );
};

export default React.memo(ChemicalWarehouseTable);
